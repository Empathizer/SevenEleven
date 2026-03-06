const mongoose = require('mongoose');

async function testWalletOperations() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb+srv://empathizer:2491p100@cluster0.agfqdlm.mongodb.net/seveneleven';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB\n');

    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const Seller = mongoose.model('Seller', new mongoose.Schema({}, { strict: false }));
    
    // Find a seller
    const seller = await User.findOne({ role: 'seller' });
    if (!seller) {
      console.log('No seller found');
      process.exit(0);
    }

    console.log('Testing seller:', seller.name);
    console.log('Seller ID:', seller._id);
    console.log('\nBefore operation:');
    console.log('- Wallet Balance:', seller.walletBalance || 0);
    console.log('- Total Recharge:', seller.totalRecharge || 0);
    console.log('- Total Withdrawn:', seller.totalWithdrawn || 0);

    // Check Seller model sync
    const sellerDoc = await Seller.findOne({ userId: seller._id });
    if (sellerDoc) {
      console.log('\nSeller model:');
      console.log('- Wallet Balance:', sellerDoc.walletBalance || 0);
      console.log('- Total Recharge:', sellerDoc.totalRecharge || 0);
      console.log('- Total Withdrawn:', sellerDoc.totalWithdrawn || 0);
    }

    console.log('\n✅ Routes are ready to test');
    console.log(`\nTest deposit: POST /api/admin/sellers/${seller._id}/wallet/deposit`);
    console.log('Body: { "amount": 100, "note": "Test deposit" }');
    console.log(`\nTest deduct: POST /api/admin/sellers/${seller._id}/wallet/deduct`);
    console.log('Body: { "amount": 50, "note": "Test deduction" }');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testWalletOperations();
