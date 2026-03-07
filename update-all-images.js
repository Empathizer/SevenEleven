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

const genericImages = {
  watch: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600", "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600"],
  mouse: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600", "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600"],
  headphone: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600", "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600"],
  backpack: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600", "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600"],
  phone: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600", "https://images.unsplash.com/photo-1592286927505-4fd4d3d4ef9f?w=600"],
  webcam: ["https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=600", "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=600"],
  ssd: ["https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600", "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=600"],
  speaker: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600", "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600"],
  hub: ["https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600", "https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=600"],
  light: ["https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600", "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600"],
  cable: ["https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600", "https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=600"],
  charger: ["https://images.unsplash.com/photo-1591290619762-d2c9e0a4e6e8?w=600", "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600"],
  protector: ["https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600", "https://images.unsplash.com/photo-1585789575825-9e5c7c5e8b3f?w=600"],
  stand: ["https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600", "https://images.unsplash.com/photo-1631465804812-1f0e3c0ac8d2?w=600"],
  cooling: ["https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600", "https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=600"],
  fitness: ["https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600", "https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=600"],
  keyboard: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600", "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600"],
  earphone: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600", "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=600"],
  monitor: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600", "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=600"],
  microphone: ["https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600", "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=600"],
  controller: ["https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=600", "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600"],
  drive: ["https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600", "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=600"],
  default: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600", "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600"]
};

function getImagesForProduct(name) {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('watch')) return genericImages.watch;
  if (lowerName.includes('mouse')) return genericImages.mouse;
  if (lowerName.includes('headphone') || lowerName.includes('earphone') || lowerName.includes('earbud')) return genericImages.headphone;
  if (lowerName.includes('backpack')) return genericImages.backpack;
  if (lowerName.includes('phone') && !lowerName.includes('stand')) return genericImages.phone;
  if (lowerName.includes('webcam')) return genericImages.webcam;
  if (lowerName.includes('ssd') || lowerName.includes('drive')) return genericImages.ssd;
  if (lowerName.includes('speaker')) return genericImages.speaker;
  if (lowerName.includes('hub') || lowerName.includes('adapter')) return genericImages.hub;
  if (lowerName.includes('light') || lowerName.includes('lamp')) return genericImages.light;
  if (lowerName.includes('cable')) return genericImages.cable;
  if (lowerName.includes('charger') || lowerName.includes('power bank')) return genericImages.charger;
  if (lowerName.includes('protector')) return genericImages.protector;
  if (lowerName.includes('stand')) return genericImages.stand;
  if (lowerName.includes('cooling')) return genericImages.cooling;
  if (lowerName.includes('fitness') || lowerName.includes('tracker')) return genericImages.fitness;
  if (lowerName.includes('keyboard')) return genericImages.keyboard;
  if (lowerName.includes('monitor')) return genericImages.monitor;
  if (lowerName.includes('microphone')) return genericImages.microphone;
  if (lowerName.includes('controller')) return genericImages.controller;
  
  return genericImages.default;
}

async function updateAllProducts() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB\n');

    const productSchema = new mongoose.Schema({
      name: String,
      images: [String],
      sellerId: mongoose.Schema.Types.ObjectId
    }, { timestamps: true });

    const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

    const productsWithoutRealImages = await Product.find({
      sellerId: null,
      $or: [
        { images: { $exists: false } },
        { images: { $size: 0 } },
        { images: { $not: { $elemMatch: { $regex: 'unsplash.com' } } } }
      ]
    });

    console.log(`Found ${productsWithoutRealImages.length} products to update\n`);

    let updated = 0;

    for (const product of productsWithoutRealImages) {
      const newImages = getImagesForProduct(product.name);
      
      await Product.updateOne(
        { _id: product._id },
        { $set: { images: newImages } }
      );

      console.log(`✅ ${product.name}`);
      updated++;
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`✅ Updated ${updated} products with real images`);
    console.log('='.repeat(50));

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateAllProducts();
