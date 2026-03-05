const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load environment variables
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...values] = line.split('=');
    if (key && values.length) {
      process.env[key.trim()] = values.join('=').trim();
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI;

async function testSellerSync() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const User = require('./server/models/User');
    const Seller = require('./server/models/Seller');

    // Find a seller user
    const seller = await Seller.findOne().populate('userId');
    if (!seller) {
      console.log('❌ No sellers found in database');
      process.exit(1);
    }

    const userId = seller.userId._id;
    console.log('📋 Testing with Seller:', seller.storeName);
    console.log('   User ID:', userId);
    console.log('   Email:', seller.userId.email);
    console.log('\n--- BEFORE UPDATE ---');
    
    const userBefore = await User.findById(userId);
    const sellerBefore = await Seller.findOne({ userId });
    
    console.log('User Model:');
    console.log('  - walletBalance:', userBefore.walletBalance);
    console.log('  - storeName:', userBefore.storeName);
    console.log('  - guaranteeMoney:', userBefore.guaranteeMoney);
    console.log('  - package:', userBefore.package);
    
    console.log('\nSeller Model:');
    console.log('  - walletBalance:', sellerBefore.walletBalance);
    console.log('  - storeName:', sellerBefore.storeName);
    console.log('  - guaranteeMoney:', sellerBefore.guaranteeMoney);
    console.log('  - package:', sellerBefore.package);

    // Simulate admin update
    console.log('\n🔄 Simulating Admin Update...');
    const testData = {
      walletBalance: 9999.99,
      storeName: 'TEST STORE UPDATED',
      guaranteeMoney: 5000,
      package: 'PREMIUM TEST',
      viewsBase: 1000,
      viewsInc: 50
    };

    // Update User model
    await User.findByIdAndUpdate(userId, testData);
    
    // Sync to Seller model (simulating API logic)
    const sellerFields = {
      storeName: testData.storeName,
      walletBalance: testData.walletBalance,
      guaranteeMoney: testData.guaranteeMoney,
      package: testData.package,
      viewsBase: testData.viewsBase,
      viewsInc: testData.viewsInc
    };
    await Seller.findOneAndUpdate({ userId }, sellerFields);

    console.log('\n--- AFTER UPDATE ---');
    
    const userAfter = await User.findById(userId);
    const sellerAfter = await Seller.findOne({ userId });
    
    console.log('User Model:');
    console.log('  - walletBalance:', userAfter.walletBalance);
    console.log('  - storeName:', userAfter.storeName);
    console.log('  - guaranteeMoney:', userAfter.guaranteeMoney);
    console.log('  - package:', userAfter.package);
    console.log('  - viewsBase:', userAfter.viewsBase);
    
    console.log('\nSeller Model:');
    console.log('  - walletBalance:', sellerAfter.walletBalance);
    console.log('  - storeName:', sellerAfter.storeName);
    console.log('  - guaranteeMoney:', sellerAfter.guaranteeMoney);
    console.log('  - package:', sellerAfter.package);
    console.log('  - viewsBase:', sellerAfter.viewsBase);

    // Verify sync
    console.log('\n--- VERIFICATION ---');
    const synced = 
      userAfter.walletBalance === sellerAfter.walletBalance &&
      userAfter.storeName === sellerAfter.storeName &&
      userAfter.guaranteeMoney === sellerAfter.guaranteeMoney &&
      userAfter.package === sellerAfter.package;

    if (synced) {
      console.log('✅ SUCCESS: Data is synchronized between User and Seller models');
    } else {
      console.log('❌ FAILED: Data mismatch detected');
    }

    // Restore original values
    console.log('\n🔄 Restoring original values...');
    await User.findByIdAndUpdate(userId, {
      walletBalance: userBefore.walletBalance,
      storeName: userBefore.storeName,
      guaranteeMoney: userBefore.guaranteeMoney,
      package: userBefore.package,
      viewsBase: userBefore.viewsBase,
      viewsInc: userBefore.viewsInc
    });
    await Seller.findOneAndUpdate({ userId }, {
      walletBalance: sellerBefore.walletBalance,
      storeName: sellerBefore.storeName,
      guaranteeMoney: sellerBefore.guaranteeMoney,
      package: sellerBefore.package,
      viewsBase: sellerBefore.viewsBase,
      viewsInc: sellerBefore.viewsInc
    });
    console.log('✅ Original values restored\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testSellerSync();
