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
  getSellerTransactions
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);

router.get('/sellers', getSellers);
router.put('/sellers/:id/approve', approveSeller);
router.put('/sellers/:id/reject', rejectSeller);
router.get('/sellers/:sellerId/wallet', getSellerWallet);
router.post('/sellers/:sellerId/deposit', addDeposit);
router.post('/sellers/:sellerId/deduct', deductAmount);
router.get('/sellers/:sellerId/transactions', getSellerTransactions);

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
