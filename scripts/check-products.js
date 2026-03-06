const mongoose = require('mongoose');

async function checkProducts() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb+srv://empathizer:2491p100@cluster0.agfqdlm.mongodb.net/seveneleven';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Count all products
    const totalProducts = await db.collection('products').countDocuments();
    console.log('\nTotal products:', totalProducts);
    
    // Count admin products (sellerId is null)
    const adminProducts = await db.collection('products').countDocuments({ sellerId: null });
    console.log('Admin products (sellerId=null):', adminProducts);
    
    // Count seller products
    const sellerProducts = await db.collection('products').countDocuments({ sellerId: { $ne: null } });
    console.log('Seller products:', sellerProducts);
    
    // Show sample admin products
    console.log('\nSample admin products:');
    const samples = await db.collection('products').find({ sellerId: null }).limit(5).toArray();
    samples.forEach(p => {
      console.log(`- ${p.name} ($${p.price}) - sellerId: ${p.sellerId}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkProducts();
