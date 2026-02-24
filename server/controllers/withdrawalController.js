const WithdrawalRequest = require('../models/WithdrawalRequest');
const Seller = require('../models/Seller');
const { logAdminAction } = require('../utils/auditLog');

exports.createWithdrawalRequest = async (req, res) => {
  try {
    const { amount } = req.body;
    const seller = await Seller.findOne({ userId: req.user._id });

    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller not found' });
    }

    if (seller.walletBalance < amount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Insufficient balance' 
      });
    }

    const withdrawal = await WithdrawalRequest.create({
      sellerId: seller._id,
      amount
    });

    res.status(201).json({ success: true, data: withdrawal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getWithdrawalRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const requests = await WithdrawalRequest.find(filter)
      .populate({
        path: 'sellerId',
        populate: { path: 'userId', select: 'name email' }
      })
      .sort('-createdAt');

    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.processWithdrawalRequest = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const withdrawal = await WithdrawalRequest.findById(req.params.id);

    if (!withdrawal) {
      return res.status(404).json({ 
        success: false, 
        message: 'Withdrawal request not found' 
      });
    }

    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: 'Request already processed' 
      });
    }

    withdrawal.status = status;
    withdrawal.adminNote = adminNote;
    withdrawal.processedBy = req.user._id;
    withdrawal.processedAt = new Date();

    if (status === 'approved') {
      const seller = await Seller.findById(withdrawal.sellerId);
      if (seller.walletBalance < withdrawal.amount) {
        return res.status(400).json({ 
          success: false, 
          message: 'Insufficient seller balance' 
        });
      }
      seller.walletBalance -= withdrawal.amount;
      seller.totalWithdrawn += withdrawal.amount;
      await seller.save();
    }

    await withdrawal.save();

    await logAdminAction(
      req.user._id,
      'PROCESS_WITHDRAWAL_REQUEST',
      withdrawal._id,
      'WithdrawalRequest',
      { status, amount: withdrawal.amount },
      req.ip
    );

    res.json({ success: true, data: withdrawal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
