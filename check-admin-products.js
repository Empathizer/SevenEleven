const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

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

async function checkProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB\n');

    const Product = require('./server/models/Product');
    
    const adminProducts = await Product.find({ sellerId: null }).limit(5);
    const allProducts = await Product.countDocuments();
    const sellerProducts = await Product.countDocuments({ sellerId: { $ne: null } });
    
    console.log('📊 Products Summary:');
    console.log(`   Total Products: ${allProducts}`);
    console.log(`   Admin Products (sellerId=null): ${adminProducts.length}`);
    console.log(`   Seller Products: ${sellerProducts}`);
    
    if (adminProducts.length === 0) {
      console.log('\n❌ NO ADMIN PRODUCTS FOUND!');
      console.log('   You need to add products via admin panel first.');
      console.log('   Go to: /admin/products/new');
    } else {
      console.log('\n✅ Admin Products Found:');
      adminProducts.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.name} - $${p.price}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkProducts();
