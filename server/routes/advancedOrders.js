const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  generateReceipt
} = require('../controllers/advancedOrderController');

router.use(protect);
router.use(authorize('admin'));

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);
router.delete('/:id', deleteOrder);
router.get('/:id/receipt', generateReceipt);

module.exports = router;
