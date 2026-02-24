const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { faker } = require('@faker-js/faker');

const getVirtualCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer', isVirtual: true }).select('-password');
    res.json({ success: true, customers, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const generateVirtualCustomers = async (req, res) => {
  try {
    const { count = 1 } = req.body;
    const customers = [];
    
    for (let i = 0; i < count; i++) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const customer = await User.create({
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: hashedPassword,
        role: 'customer',
        status: 'active',
        isVirtual: true,
        address: faker.location.streetAddress()
      });
      customers.push(customer);
    }
    
    res.json({ success: true, customers, message: `${count} virtual customer(s) created` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const loginAsUser = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getVirtualCustomers,
  generateVirtualCustomers,
  loginAsUser
};