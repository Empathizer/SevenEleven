const User = require('../models/User');

const getVirtualCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer', isVirtual: true }).select('-password');
    res.json({ success: true, customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getVirtualCustomers
};