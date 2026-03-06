const mongoose = require('mongoose');

async function testAPI() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb+srv://empathizer:2491p100@cluster0.agfqdlm.mongodb.net/seveneleven';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // Import Product model
    const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
    
    // Test the query that API uses
    const query = { sellerId: null };
    console.log('\nQuery:', JSON.stringify(query));
    
    const products = await Product.find(query)
      .limit(20)
      .sort('-createdAt')
      .maxTimeMS(30000);

    console.log('\nProducts found:', products.length);
    console.log('\nFirst 3 products:');
    products.slice(0, 3).forEach(p => {
      console.log(`- ${p.name} ($${p.price})`);
      console.log(`  sellerId: ${p.sellerId}`);
      console.log(`  categoryId: ${p.categoryId}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testAPI();
