const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createWithdrawalRequest,
  getWithdrawalRequests,
  processWithdrawalRequest
} = require('../controllers/withdrawalController');

// Seller routes
router.post('/', protect, authorize('seller'), createWithdrawalRequest);

// Admin routes
router.get('/', protect, authorize('admin'), getWithdrawalRequests);
router.put('/:id', protect, authorize('admin'), processWithdrawalRequest);

module.exports = router;
