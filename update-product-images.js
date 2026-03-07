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

async function updateProductImages() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB\n');

    const productSchema = new mongoose.Schema({
      name: String,
      description: String,
      price: Number,
      buyingPrice: Number,
      categoryId: mongoose.Schema.Types.ObjectId,
      sellerId: mongoose.Schema.Types.ObjectId,
      images: [String],
      stock: Number,
      rating: Number,
      reviewCount: Number,
      sold: Number
    }, { timestamps: true });

    const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

    const products = await Product.find({ sellerId: null });
    console.log(`Found ${products.length} admin products\n`);

    let updated = 0;

    for (const product of products) {
      const newImages = [
        `https://placehold.co/600x600/EEE/333?text=${encodeURIComponent(product.name.substring(0, 20))}`,
        `https://placehold.co/600x600/DDD/333?text=Product`
      ];

      await Product.updateOne(
        { _id: product._id },
        { $set: { images: newImages } }
      );

      console.log(`✅ Updated: ${product.name}`);
      updated++;
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`✅ Updated ${updated} products with new images`);
    console.log('='.repeat(50));

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateProductImages();
