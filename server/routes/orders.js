const express = require('express');
const { createOrder, getOrders, getOrder, updateOrderStatus } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', authorize('customer'), createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.put('/:id/status', authorize('admin', 'seller'), updateOrderStatus);

module.exports = router;
