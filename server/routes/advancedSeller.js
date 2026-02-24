const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  setSellerPackage,
  setSellerSalesman,
  setSellerViews,
  setSellerGuarantee,
  sendMessageToSeller,
  adjustSellerBalance
} = require('../controllers/advancedSellerController');

router.use(protect);
router.use(authorize('admin'));

router.put('/:id/package', setSellerPackage);
router.put('/:id/salesman', setSellerSalesman);
router.put('/:id/views', setSellerViews);
router.put('/:id/guarantee', setSellerGuarantee);
router.post('/:id/message', sendMessageToSeller);
router.post('/:id/balance', adjustSellerBalance);

module.exports = router;
