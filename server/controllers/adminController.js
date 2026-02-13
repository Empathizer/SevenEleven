const User = require('../models/User');
const Seller = require('../models/Seller');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const Banner = require('../models/Banner');
const WalletTransaction = require('../models/WalletTransaction');

exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalSellers = await User.countDocuments({ role: 'seller' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingSellers = await Seller.countDocuments({ status: 'pending' });
    
    const orders = await Order.find();
    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalSellers,
        totalProducts,
        totalOrders,
        totalSales,
        pendingSellers
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSellers = async (req, res) => {
  try {
    const sellers = await Seller.find().populate('userId', 'name email walletBalance totalEarnings totalWithdrawn');
    res.json({ success: true, sellers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveSeller = async (req, res) => {
  try {
    const seller = await Seller.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    await User.findByIdAndUpdate(seller.userId, { status: 'active' });
    res.json({ success: true, seller });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.rejectSeller = async (req, res) => {
  try {
    const { reason } = req.body;
    const seller = await Seller.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', rejectionReason: reason },
      { new: true }
    );
    await User.findByIdAndUpdate(seller.userId, { status: 'blocked' });
    res.json({ success: true, seller });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('sellerId', 'name').populate('categoryId');
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email').sort('-createdAt');
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.json({ success: true, banners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createBanner = async (req, res) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json({ success: true, banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Banner deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSellerWallet = async (req, res) => {
  try {
    const user = await User.findById(req.params.sellerId);
    if (!user || user.role !== 'seller') {
      return res.status(404).json({ success: false, message: 'Seller not found' });
    }
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

exports.addDeposit = async (req, res) => {
  try {
    const { amount, note } = req.body;
    const seller = await User.findById(req.params.sellerId);
    
    if (!seller || seller.role !== 'seller') {
      return res.status(404).json({ success: false, message: 'Seller not found' });
    }

    seller.walletBalance = (seller.walletBalance || 0) + amount;
    seller.totalEarnings = (seller.totalEarnings || 0) + amount;
    await seller.save();

    const transaction = await WalletTransaction.create({
      sellerId: seller._id,
      type: 'deposit',
      amount,
      note,
      createdBy: req.user.id
    });

    res.json({ success: true, transaction, wallet: {
      walletBalance: seller.walletBalance,
      totalEarnings: seller.totalEarnings,
      totalWithdrawn: seller.totalWithdrawn
    }});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deductAmount = async (req, res) => {
  try {
    const { amount, note } = req.body;
    const seller = await User.findById(req.params.sellerId);
    
    if (!seller || seller.role !== 'seller') {
      return res.status(404).json({ success: false, message: 'Seller not found' });
    }

    if (seller.walletBalance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    seller.walletBalance = (seller.walletBalance || 0) - amount;
    seller.totalWithdrawn = (seller.totalWithdrawn || 0) + amount;
    await seller.save();

    const transaction = await WalletTransaction.create({
      sellerId: seller._id,
      type: 'adjustment',
      amount: -amount,
      note,
      createdBy: req.user.id
    });

    res.json({ success: true, transaction, wallet: {
      walletBalance: seller.walletBalance,
      totalEarnings: seller.totalEarnings,
      totalWithdrawn: seller.totalWithdrawn
    }});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSellerTransactions = async (req, res) => {
  try {
    const transactions = await WalletTransaction.find({ 
      sellerId: req.params.sellerId 
    }).sort('-createdAt');
    res.json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
