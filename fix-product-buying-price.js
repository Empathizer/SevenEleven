const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Read .env.local file
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');
for (const line of envLines) {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    process.env[key.trim()] = valueParts.join('=').trim();
  }
}

const MONGODB_URI = process.env.MONGODB_URI;

async function fixProductBuyingPrices() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB');

    const Product = require('./server/models/Product');

    // Find all seller products (products with sellerId)
    const sellerProducts = await Product.find({ 
      sellerId: { $ne: null, $exists: true },
      $or: [
        { buyingPrice: 0 },
        { buyingPrice: { $exists: false } }
      ]
    }).limit(100);

    console.log(`Found ${sellerProducts.length} seller products with missing/zero buyingPrice`);

    let updated = 0;
    for (const product of sellerProducts) {
      // Set buyingPrice to 80% of selling price as a reasonable estimate
      // This assumes roughly 20% profit margin
      const estimatedBuyingPrice = product.price * 0.8;
      
      await Product.findByIdAndUpdate(product._id, {
        buyingPrice: estimatedBuyingPrice
      });
      
      updated++;
      console.log(`Updated ${product.name}: buyingPrice set to $${estimatedBuyingPrice.toFixed(2)} (price: $${product.price})`);
    }

    console.log(`Done! ${updated} products updated.`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixProductBuyingPrices();
