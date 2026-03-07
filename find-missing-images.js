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

async function findProductsWithoutRealImages() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });

    const productSchema = new mongoose.Schema({
      name: String,
      images: [String]
    }, { timestamps: true });

    const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

    const adminProducts = await Product.find({ sellerId: null });
    
    const withoutRealImages = adminProducts.filter(p => 
      !p.images || p.images.length === 0 || 
      !p.images[0].includes('unsplash.com')
    );

    console.log(`\nFound ${withoutRealImages.length} products without real images:\n`);
    withoutRealImages.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`);
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

findProductsWithoutRealImages();
