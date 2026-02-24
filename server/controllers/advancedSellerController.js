const Seller = require('../models/Seller');

const getSellerDetails = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id).populate('userId', 'name email');
    res.json({ success: true, seller });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSellerDetails
};