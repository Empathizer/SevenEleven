const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Seller = require('../models/Seller');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, storeName, storeDescription, idType, idNumber, idImage, address, invitationCode } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    if (role === 'seller') {
      if (!invitationCode) {
        return res.status(400).json({ success: false, message: 'Invitation code is required for seller registration' });
      }
      
      const validInvitation = await Seller.findOne({ invitationCode, status: 'approved' });
      if (validInvitation) {
        return res.status(400).json({ success: false, message: 'This invitation code has already been used' });
      }
      
      const unusedInvitation = await Seller.findOne({ invitationCode, userId: { $exists: false } });
      if (!unusedInvitation) {
        return res.status(400).json({ success: false, message: 'Invalid invitation code' });
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'customer',
      status: role === 'seller' ? 'pending' : 'active'
    });

    if (role === 'seller') {
      await Seller.create({
        userId: user._id,
        storeName,
        storeDescription,
        idType,
        idNumber,
        idImage,
        address,
        invitationCode,
        status: 'pending'
      });
    }

    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      },
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.role === 'seller') {
      const seller = await Seller.findOne({ userId: user._id });
      if (seller && seller.status !== 'approved') {
        return res.status(403).json({ 
          success: false, 
          message: 'Your seller account is pending approval' 
        });
      }
    }

    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        storeName: user.name
      },
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    let sellerInfo = null;
    if (user.role === 'seller') {
      sellerInfo = await Seller.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        walletBalance: user.walletBalance,
        totalEarnings: user.totalEarnings,
        totalWithdrawn: user.totalWithdrawn,
        storeName: sellerInfo?.storeName,
        seller: sellerInfo
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.json({ success: true, message: 'Logged out successfully' });
};
