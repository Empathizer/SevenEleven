const { faker } = require('@faker-js/faker');
const User = require('../models/User');
const { logAdminAction } = require('../utils/auditLog');

exports.generateVirtualCustomers = async (req, res) => {
  try {
    const { count, initialBalance, packageName } = req.body;

    if (!count || count < 1 || count > 200) {
      return res.status(400).json({ 
        success: false, 
        message: 'Count must be between 1 and 200' 
      });
    }

    const virtualCustomers = [];
    for (let i = 0; i < count; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      virtualCustomers.push({
        name: `${firstName} ${lastName}`,
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        password: await require('bcryptjs').hash('virtual123', 12),
        phone: faker.phone.number(),
        role: 'customer',
        isVirtual: true,
        walletBalance: initialBalance || 0,
        package: packageName || 'Basic',
        status: 'active'
      });
    }

    const result = await User.insertMany(virtualCustomers);

    await logAdminAction(
      req.user._id,
      'GENERATE_VIRTUAL_CUSTOMERS',
      null,
      'User',
      { count, initialBalance, packageName },
      req.ip
    );

    res.status(201).json({
      success: true,
      message: `${result.length} virtual customers created`,
      data: result
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

exports.getVirtualCustomers = async (req, res) => {
  try {
    const customers = await User.find({ isVirtual: true })
      .select('-password')
      .sort('-createdAt');

    res.json({
      success: true,
      count: customers.length,
      data: customers
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

exports.loginAsUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    await logAdminAction(
      req.user._id,
      'LOGIN_AS_USER',
      user._id,
      'User',
      { userName: user.name, userEmail: user.email },
      req.ip
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: `Logged in as ${user.name}`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
