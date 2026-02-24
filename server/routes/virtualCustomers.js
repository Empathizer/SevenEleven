const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  generateVirtualCustomers,
  getVirtualCustomers,
  loginAsUser
} = require('../controllers/virtualCustomerController');

router.use(protect);
router.use(authorize('admin'));

router.post('/generate', generateVirtualCustomers);
router.get('/', getVirtualCustomers);
router.post('/login-as/:id', loginAsUser);

module.exports = router;
