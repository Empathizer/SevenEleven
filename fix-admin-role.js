// Run this script to fix admin role in database
// node fix-admin-role.js

const mongoose = require('mongoose');

async function fixAdminRole() {
  try {
    const MONGODB_URI = 'mongodb+srv://empathizer:2491p100@cluster0.agfqdlm.mongodb.net/seveneleven';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const User = require('./server/models/User');
    
    // Find user with admin email
    const adminEmail = 'admin@esellerstore.com';
    const admin = await User.findOne({ email: adminEmail });
    
    if (!admin) {
      console.log('❌ Admin user not found. Creating new admin...');
      const newAdmin = await User.create({
        name: 'Admin',
        email: adminEmail,
        password: 'admin123',
        role: 'admin',
        status: 'active'
      });
      console.log('✅ Admin created:', newAdmin.email, 'Role:', newAdmin.role);
    } else {
      console.log('Found user:', admin.email, 'Current role:', admin.role);
      
      if (admin.role !== 'admin') {
        admin.role = 'admin';
        admin.status = 'active';
        await admin.save();
        console.log('✅ Admin role fixed!');
      } else {
        console.log('✅ Admin role is already correct');
      }
    }
    
    await mongoose.disconnect();
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixAdminRole();
