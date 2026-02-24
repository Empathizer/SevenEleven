const express = require('express');
const {
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
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.get('/users/:id', async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.put('/users/:id', async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.delete('/users/:id', async (req, res) => {
  try {
    const User = require('../models/User');
    await User.findByIdAndUpdate(req.params.id, { status: 'blocked' });
    res.json({ success: true, message: 'User blocked' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.put('/users/:id/restore', async (req, res) => {
  try {
    const User = require('../models/User');
    await User.findByIdAndUpdate(req.params.id, { status: 'active' });
    res.json({ success: true, message: 'User restored' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/sellers', getSellers);
router.put('/sellers/:id/approve', approveSeller);
router.put('/sellers/:id/reject', rejectSeller);
router.get('/sellers/:sellerId/wallet', getSellerWallet);
router.get('/sellers/:sellerId/stats', getSellerStats);
router.post('/sellers/:sellerId/deposit', addDeposit);
router.post('/sellers/:sellerId/deduct', deductAmount);
router.get('/sellers/:sellerId/transactions', getSellerTransactions);

router.post('/login-as/:userId', async (req, res) => {
  try {
    const User = require('../models/User');
    const jwt = require('jsonwebtoken');
    
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/messages', async (req, res) => {
  try {
    const Message = require('../models/Message');
    const message = await Message.create({
      senderId: req.user.id,
      receiverId: req.body.receiverId,
      message: req.body.message
    });
    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/orders/:id', async (req, res) => {
  try {
    const Order = require('../models/Order');
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/orders/virtual', async (req, res) => {
  try {
    const Order = require('../models/Order');
    const Product = require('../models/Product');
    const { customerId, sellerId, items, totalAmount, shippingAddress } = req.body;
    
    const order = await Order.create({
      userId: customerId,
      items: items.map(item => ({
        ...item,
        sellerId,
        profit: (item.price - (item.buyingPrice || 0)) * item.quantity
      })),
      totalAmount,
      profit: items.reduce((sum, item) => sum + (item.price - (item.buyingPrice || 0)) * item.quantity, 0),
      shippingAddress,
      paymentMethod: 'COD',
      paymentStatus: 'paid',
      status: 'pending'
    });
    
    // Update product stock and sold count
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { sold: item.quantity, stock: -item.quantity }
      });
    }
    
    // Add to seller pending balance and deduct buying price from wallet
    const User = require('../models/User');
    const buyingCost = items.reduce((sum, item) => sum + (item.buyingPrice || 0) * item.quantity, 0);
    console.log(`Virtual order - Seller ${sellerId}: Adding ${totalAmount} to pending, deducting ${buyingCost} from wallet`);
    await User.findByIdAndUpdate(sellerId, {
      $inc: { 
        pendingBalance: totalAmount,
        walletBalance: -buyingCost
      }
    });
    
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/sellers/virtual', async (req, res) => {
  try {
    const User = require('../models/User');
    const Seller = require('../models/Seller');
    const { name, email, password, storeName } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    
    const user = await User.create({
      name,
      email,
      password,
      role: 'seller',
      status: 'active',
      isVirtual: true
    });
    
    const invitationCode = 'INV' + Math.random().toString(36).substr(2, 8).toUpperCase();
    
    await Seller.create({
      userId: user._id,
      storeName,
      status: 'approved',
      idType: 'CNIC',
      idNumber: 'N/A',
      idImage: 'N/A',
      address: 'Virtual Address',
      invitationCode
    });
    
    res.json({ success: true, user, invitationCode });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/sellers/:id/invitation', async (req, res) => {
  try {
    const Seller = require('../models/Seller');
    const { invitationCode } = req.body;
    await Seller.findByIdAndUpdate(req.params.id, { invitationCode });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/products', getAllProducts);
router.delete('/products/:id', deleteProduct);

router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

router.get('/orders', getAllOrders);

router.get('/banners', getBanners);
router.post('/banners', createBanner);
router.put('/banners/:id', updateBanner);
router.delete('/banners/:id', deleteBanner);

module.exports = router;
