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

const newProducts = {
  "accessories": [
    { name: "Smartwatch Band Leather", description: "Premium leather replacement band for smartwatches", price: 24.99, stock: 80, images: ["https://images.unsplash.com/photo-1617625802912-cde586faf331?w=600", "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600"] },
    { name: "Portable Charger 30000mAh", description: "Ultra high capacity power bank with fast charging", price: 49.99, stock: 60, images: ["https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600", "https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=600"] },
    { name: "Phone Gimbal Stabilizer", description: "3-axis smartphone gimbal for smooth video", price: 89.99, stock: 35, images: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600", "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600"] },
    { name: "Car Phone Mount", description: "Magnetic car phone holder with 360° rotation", price: 19.99, stock: 100, images: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600", "https://images.unsplash.com/photo-1585789575825-9e5c7c5e8b3f?w=600"] },
    { name: "Laptop Sleeve 15 inch", description: "Waterproof laptop sleeve with extra pockets", price: 29.99, stock: 70, images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600", "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600"] },
    { name: "USB Flash Drive 128GB", description: "High-speed USB 3.0 flash drive", price: 22.99, stock: 90, images: ["https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600", "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=600"] },
    { name: "Selfie Ring Light", description: "Portable LED ring light for selfies and videos", price: 34.99, stock: 65, images: ["https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600", "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600"] },
    { name: "Wireless Keyboard Mouse Combo", description: "Slim wireless keyboard and mouse set", price: 44.99, stock: 55, images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600", "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600"] },
    { name: "Gaming Headset RGB", description: "7.1 surround sound gaming headset with mic", price: 59.99, stock: 50, images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600", "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600"] },
    { name: "Portable SSD 500GB", description: "External solid state drive with USB-C", price: 79.99, stock: 45, images: ["https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600", "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=600"] }
  ],
  "beauty": [
    { name: "Hair Straightener Ceramic", description: "Professional ceramic hair straightener", price: 39.99, stock: 50, images: ["https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600", "https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=600"] },
    { name: "Facial Cleansing Brush", description: "Electric facial cleansing brush with 3 speeds", price: 34.99, stock: 60, images: ["https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600", "https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=600"] },
    { name: "Nail Polish Set 12 Colors", description: "Long-lasting nail polish collection", price: 29.99, stock: 70, images: ["https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=600", "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=600"] },
    { name: "Hair Dryer Professional", description: "Ionic hair dryer with diffuser attachment", price: 54.99, stock: 45, images: ["https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600", "https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=600"] },
    { name: "Makeup Organizer Acrylic", description: "Clear acrylic makeup storage organizer", price: 24.99, stock: 80, images: ["https://images.unsplash.com/photo-1583241800698-c318c76ca7e8?w=600", "https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=600"] },
    { name: "Face Mask Sheet Pack", description: "Hydrating face mask sheets 20-pack", price: 19.99, stock: 100, images: ["https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600", "https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=600"] },
    { name: "Eyelash Curler", description: "Professional eyelash curler with refill pads", price: 12.99, stock: 90, images: ["https://images.unsplash.com/photo-1583241800698-c318c76ca7e8?w=600", "https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=600"] },
    { name: "Body Lotion Set", description: "Moisturizing body lotion 3-piece set", price: 34.99, stock: 65, images: ["https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600", "https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=600"] }
  ],
  "jewelry": [
    { name: "Stainless Steel Bracelet", description: "Men's stainless steel chain bracelet", price: 34.99, stock: 55, images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600", "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600"] },
    { name: "Crystal Pendant Necklace", description: "Elegant crystal pendant with silver chain", price: 44.99, stock: 50, images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600", "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600"] },
    { name: "Hoop Earrings Gold", description: "Classic gold-plated hoop earrings", price: 29.99, stock: 70, images: ["https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=600", "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600"] },
    { name: "Charm Bracelet Silver", description: "Sterling silver charm bracelet with 5 charms", price: 49.99, stock: 45, images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600", "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600"] },
    { name: "Anklet Chain", description: "Delicate anklet with adjustable chain", price: 24.99, stock: 60, images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600", "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600"] }
  ],
  "mens-apparel": [
    { name: "Polo Shirt", description: "Classic fit polo shirt in multiple colors", price: 34.99, stock: 70, images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600", "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600"] },
    { name: "Cargo Shorts", description: "Comfortable cargo shorts with pockets", price: 39.99, stock: 60, images: ["https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600", "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600"] },
    { name: "Winter Jacket", description: "Warm winter jacket with hood", price: 89.99, stock: 40, images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600", "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=600"] },
    { name: "Track Pants", description: "Athletic track pants with zipper pockets", price: 44.99, stock: 55, images: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600", "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600"] },
    { name: "Dress Pants", description: "Formal dress pants slim fit", price: 54.99, stock: 50, images: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600", "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600"] }
  ],
  "womens-apparel": [
    { name: "Yoga Pants", description: "High-waist yoga pants with pockets", price: 39.99, stock: 75, images: ["https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600", "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=600"] },
    { name: "Tank Top", description: "Casual tank top in various colors", price: 19.99, stock: 90, images: ["https://images.unsplash.com/photo-1564257577-d18b7c1a9b78?w=600", "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=600"] },
    { name: "Leggings", description: "Comfortable stretch leggings", price: 29.99, stock: 85, images: ["https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600", "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=600"] },
    { name: "Denim Jacket", description: "Classic denim jacket for women", price: 64.99, stock: 45, images: ["https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600", "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600"] },
    { name: "Evening Gown", description: "Elegant evening gown for special occasions", price: 129.99, stock: 25, images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600", "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600"] }
  ],
  "shoes": [
    { name: "Running Sneakers", description: "Lightweight running sneakers with cushioning", price: 74.99, stock: 55, images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600", "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600"] },
    { name: "Flip Flops", description: "Comfortable flip flops for beach", price: 14.99, stock: 100, images: ["https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600", "https://images.unsplash.com/photo-1562183241-b937e95585b6?w=600"] },
    { name: "Dress Shoes Men", description: "Formal leather dress shoes", price: 79.99, stock: 45, images: ["https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600", "https://images.unsplash.com/photo-1614252368530-9e0f6919a7e3?w=600"] },
    { name: "Ballet Flats", description: "Comfortable ballet flat shoes", price: 44.99, stock: 60, images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600", "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=600"] },
    { name: "Hiking Boots", description: "Waterproof hiking boots with ankle support", price: 99.99, stock: 35, images: ["https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600", "https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=600"] }
  ],
  "fashion": [
    { name: "Sunglasses Aviator", description: "Classic aviator sunglasses UV protection", price: 29.99, stock: 80, images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600", "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600"] },
    { name: "Baseball Cap", description: "Adjustable baseball cap cotton", price: 19.99, stock: 90, images: ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600", "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600"] },
    { name: "Scarf Wool", description: "Warm wool scarf for winter", price: 34.99, stock: 65, images: ["https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600", "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600"] },
    { name: "Belt Leather", description: "Genuine leather belt with buckle", price: 29.99, stock: 70, images: ["https://images.unsplash.com/photo-1624222247344-550fb60583bb?w=600", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600"] },
    { name: "Gloves Winter", description: "Touchscreen compatible winter gloves", price: 24.99, stock: 75, images: ["https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600", "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600"] },
    { name: "Jump Rope", description: "Adjustable speed jump rope for fitness", price: 14.99, stock: 100, images: ["https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600", "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600"] },
    { name: "Foam Roller", description: "High-density foam roller for muscle recovery", price: 29.99, stock: 70, images: ["https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600", "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600"] },
    { name: "Action Figure Set", description: "Superhero action figure collection 5-pack", price: 39.99, stock: 50, images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600", "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=600"] }
  ]
};

async function addMoreProducts() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB\n');

    const categorySchema = new mongoose.Schema({
      name: String,
      slug: String
    }, { timestamps: true });
    
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

    const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
    const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

    const categories = await Category.find({});
    console.log(`Found ${categories.length} categories\n`);

    let added = 0;
    let skipped = 0;

    for (const [catSlug, productList] of Object.entries(newProducts)) {
      const category = categories.find(c => c.slug === catSlug);
      
      if (!category) {
        console.log(`⚠️  Category "${catSlug}" not found, skipping ${productList.length} products`);
        skipped += productList.length;
        continue;
      }

      console.log(`\n📦 Adding products for: ${catSlug}`);

      for (const prod of productList) {
        const existing = await Product.findOne({ name: prod.name, categoryId: category._id });
        if (existing) {
          console.log(`  ⏭️  ${prod.name} (already exists)`);
          skipped++;
          continue;
        }

        await Product.create({
          ...prod,
          categoryId: category._id,
          sellerId: null,
          buyingPrice: 0,
          rating: (Math.random() * 2 + 3).toFixed(1),
          reviewCount: Math.floor(Math.random() * 500) + 50,
          sold: Math.floor(Math.random() * 1000) + 100
        });
        console.log(`  ✅ ${prod.name}`);
        added++;
      }
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`✅ Added: ${added} products`);
    console.log(`⏭️  Skipped: ${skipped} products`);
    console.log('='.repeat(50));

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addMoreProducts();
