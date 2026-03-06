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

const MONGODB_URI = process.env.MONGODB_URI;

async function verify() {
  try {
    console.log('🔍 Verifying Admin Products Setup...\n');
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected to MongoDB\n');

    const Product = require('./server/models/Product');
    
    // Check admin products (sellerId = null)
    const adminProducts = await Product.find({ sellerId: null }).limit(20);
    console.log(`📦 Admin Products Found: ${adminProducts.length}`);
    
    if (adminProducts.length > 0) {
      console.log('\n✅ Admin products exist in database:');
      adminProducts.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.name} - $${p.price} (Stock: ${p.stock})`);
      });
    } else {
      console.log('\n❌ No admin products found!');
      console.log('   Run the browser script to add products.');
    }
    
    // Check all products
    const allProducts = await Product.countDocuments();
    const sellerProducts = await Product.countDocuments({ sellerId: { $ne: null } });
    
    console.log(`\n📊 Database Stats:`);
    console.log(`   Total Products: ${allProducts}`);
    console.log(`   Admin Products: ${adminProducts.length}`);
    console.log(`   Seller Products: ${sellerProducts}`);
    
    console.log('\n✅ Verification Complete!');
    console.log('\n📝 Next Steps:');
    console.log('   1. Start server: npm run dev');
    console.log('   2. Login as seller');
    console.log('   3. Go to: /seller/products/new');
    console.log('   4. You should see the admin products listed above');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verify();
