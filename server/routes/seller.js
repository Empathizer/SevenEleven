const express = require('express');
const {
  getProfile,
  updateProfile,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  getWallet,
  getTransactions
} = require('../controllers/sellerController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('seller'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

router.get('/products', getProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

router.get('/orders', getOrders);

router.get('/wallet', getWallet);
router.get('/transactions', getTransactions);

module.exports = router;
