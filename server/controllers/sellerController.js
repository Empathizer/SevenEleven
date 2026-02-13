const Seller = require('../models/Seller');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const WalletTransaction = require('../models/WalletTransaction');

exports.getProfile = async (req, res) => {
  try {
    const seller = await Seller.findOne({ userId: req.user.id }).populate('userId');
    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller profile not found' });
    }
    res.json({ success: true, seller });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { storeName, storeDescription } = req.body;
    const seller = await Seller.findOneAndUpdate(
      { userId: req.user.id },
      { storeName, storeDescription },
      { new: true, runValidators: true }
    );
    res.json({ success: true, seller });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user.id }).populate('categoryId');
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      sellerId: req.user.id
    });
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, sellerId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ 
      _id: req.params.id, 
      sellerId: req.user.id 
    });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 
      'items.sellerId': req.user.id 
    }).populate('userId', 'name email').sort('-createdAt');
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      wallet: {
        walletBalance: user.walletBalance || 0,
        totalEarnings: user.totalEarnings || 0,
        totalWithdrawn: user.totalWithdrawn || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await WalletTransaction.find({ 
      sellerId: req.user.id 
    }).sort('-createdAt');
    res.json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
