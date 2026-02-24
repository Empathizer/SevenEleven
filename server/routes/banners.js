const express = require('express');
const Banner = require('../models/Banner');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true });
    res.json({ success: true, data: banners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
