const Seller = require('../models/Seller');
const User = require('../models/User');
const { logAdminAction } = require('../utils/auditLog');

exports.setSellerPackage = async (req, res) => {
  try {
    const { packageName } = req.body;
    const seller = await Seller.findByIdAndUpdate(
      req.params.id,
      { package: packageName },
      { new: true, runValidators: true }
    );

    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller not found' });
    }

    await logAdminAction(
      req.user._id,
      'SET_SELLER_PACKAGE',
      seller._id,
      'Seller',
      { packageName },
      req.ip
    );

    res.json({ success: true, data: seller });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.setSellerSalesman = async (req, res) => {
  try {
    const { salesman } = req.body;
    const seller = await Seller.findByIdAndUpdate(
      req.params.id,
      { salesman },
      { new: true, runValidators: true }
    );

    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller not found' });
    }

    await logAdminAction(
      req.user._id,
      'SET_SELLER_SALESMAN',
      seller._id,
      'Seller',
      { salesman },
      req.ip
    );

    res.json({ success: true, data: seller });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.setSellerViews = async (req, res) => {
  try {
    const { viewsBase, viewsInc } = req.body;
    const updateData = {};
    if (viewsBase !== undefined) updateData.viewsBase = viewsBase;
    if (viewsInc !== undefined) updateData.viewsInc = viewsInc;

    const seller = await Seller.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller not found' });
    }

    await logAdminAction(
      req.user._id,
      'SET_SELLER_VIEWS',
      seller._id,
      'Seller',
      { viewsBase, viewsInc },
      req.ip
    );

    res.json({ success: true, data: seller });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.setSellerGuarantee = async (req, res) => {
  try {
    const { guaranteeMoney } = req.body;
    const seller = await Seller.findByIdAndUpdate(
      req.params.id,
      { guaranteeMoney },
      { new: true, runValidators: true }
    );

    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller not found' });
    }

    await logAdminAction(
      req.user._id,
      'SET_SELLER_GUARANTEE',
      seller._id,
      'Seller',
      { guaranteeMoney },
      req.ip
    );

    res.json({ success: true, data: seller });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendMessageToSeller = async (req, res) => {
  try {
    const { message } = req.body;
    const seller = await Seller.findById(req.params.id).populate('userId');

    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller not found' });
    }

    // In production, integrate with email/notification service
    console.log(`Message to ${seller.userId.email}: ${message}`);

    await logAdminAction(
      req.user._id,
      'SEND_MESSAGE_TO_SELLER',
      seller._id,
      'Seller',
      { message },
      req.ip
    );

    res.json({ 
      success: true, 
      message: 'Message sent successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.adjustSellerBalance = async (req, res) => {
  try {
    const { amount, type, note } = req.body;
    const seller = await Seller.findById(req.params.id);

    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller not found' });
    }

    if (type === 'deposit') {
      seller.walletBalance += amount;
      seller.totalRecharge += amount;
    } else if (type === 'deduct') {
      if (seller.walletBalance < amount) {
        return res.status(400).json({ 
          success: false, 
          message: 'Insufficient balance' 
        });
      }
      seller.walletBalance -= amount;
    }

    await seller.save();

    await logAdminAction(
      req.user._id,
      type === 'deposit' ? 'DEPOSIT_SELLER_BALANCE' : 'DEDUCT_SELLER_BALANCE',
      seller._id,
      'Seller',
      { amount, note },
      req.ip
    );

    res.json({ success: true, data: seller });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
