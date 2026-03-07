const mongoose = require('mongoose');
const fs = require('fs');

let MONGODB_URI;
try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const match = envContent.match(/MONGODB_URI=(.+)/);
  MONGODB_URI = match ? match[1].trim() : null;
} catch (e) {
  console.error('Error reading .env.local');
  process.exit(1);
}

async function countAdminProducts() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });

    const productSchema = new mongoose.Schema({
      name: String,
      price: Number,
      sellerId: mongoose.Schema.Types.ObjectId,
      categoryId: mongoose.Schema.Types.ObjectId,
      images: [String],
      stock: Number
    }, { timestamps: true });

    const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

    const adminProducts = await Product.find({ sellerId: null }).populate('categoryId');
    const sellerProducts = await Product.find({ sellerId: { $ne: null } });

    console.log('\n' + '='.repeat(60));
    console.log('📊 PRODUCT STATISTICS');
    console.log('='.repeat(60));
    console.log(`\n🏪 Admin Products (Catalogue): ${adminProducts.length}`);
    console.log(`👤 Seller Products: ${sellerProducts.length}`);
    console.log(`📦 Total Products: ${adminProducts.length + sellerProducts.length}`);
    
    console.log('\n📋 Admin Products by Category:');
    const byCategory = {};
    adminProducts.forEach(p => {
      const catName = p.categoryId?.name || 'Uncategorized';
      byCategory[catName] = (byCategory[catName] || 0) + 1;
    });
    
    Object.entries(byCategory).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} products`);
    });

    console.log('\n🖼️  Image Status:');
    const withImages = adminProducts.filter(p => p.images && p.images.length > 0);
    const withRealImages = adminProducts.filter(p => 
      p.images && p.images.length > 0 && 
      p.images[0].includes('unsplash.com')
    );
    console.log(`   Products with images: ${withImages.length}/${adminProducts.length}`);
    console.log(`   Products with real images: ${withRealImages.length}/${adminProducts.length}`);

    console.log('\n💰 Price Range:');
    const prices = adminProducts.map(p => p.price).filter(p => p);
    if (prices.length > 0) {
      console.log(`   Min: $${Math.min(...prices).toFixed(2)}`);
      console.log(`   Max: $${Math.max(...prices).toFixed(2)}`);
      console.log(`   Avg: $${(prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2)}`);
    }

    console.log('\n' + '='.repeat(60) + '\n');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

countAdminProducts();
