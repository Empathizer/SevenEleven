const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const Banner = require('../models/Banner');
const Seller = require('../models/Seller');
const { sendSellerApprovalEmail } = require('../../lib/email');

const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    res.json({ success: true, data: { totalUsers, totalProducts, totalOrders } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSellers = async (req, res) => {
  try {
    const sellers = await Seller.find().populate('userId', 'name email');
    res.json({ success: true, sellers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const approveSeller = async (req, res) => {
  try {
    const seller = await Seller.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true }).populate('userId');
    
    if (seller && seller.userId) {
      await sendSellerApprovalEmail({
        email: seller.userId.email,
        name: seller.userId.name,
        storeName: seller.storeName || 'Your Store'
      });
    }
    
    res.json({ success: true, message: 'Seller approved' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const rejectSeller = async (req, res) => {
  try {
    await Seller.findByIdAndUpdate(req.params.id, { status: 'rejected' });
    res.json({ success: true, message: 'Seller rejected' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('categoryId', 'name').populate('sellerId', 'name');
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email');
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.json({ success: true, banners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createBanner = async (req, res) => {
  try {
    const banner = await Banner.create(req.body);
    res.json({ success: true, banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteBanner = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Banner deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSellerWallet = async (req, res) => {
  try {
    const user = await User.findById(req.params.sellerId);
    res.json({ success: true, wallet: { balance: user.walletBalance, pending: user.pendingBalance } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addDeposit = async (req, res) => {
  try {
    const { amount } = req.body;
    await User.findByIdAndUpdate(req.params.sellerId, { $inc: { walletBalance: amount } });
    res.json({ success: true, message: 'Deposit added' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deductAmount = async (req, res) => {
  try {
    const { amount } = req.body;
    await User.findByIdAndUpdate(req.params.sellerId, { $inc: { walletBalance: -amount } });
    res.json({ success: true, message: 'Amount deducted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSellerTransactions = async (req, res) => {
  try {
    res.json({ success: true, transactions: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSellerStats = async (req, res) => {
  try {
    res.json({ success: true, stats: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboard,
  getUsers,
  getSellers,
  approveSeller,
  rejectSeller,
  getAllProducts,
  deleteProduct,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllOrders,
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  getSellerWallet,
  addDeposit,
  deductAmount,
  getSellerTransactions,
  getSellerStats
};