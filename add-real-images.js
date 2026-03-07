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

const imageMap = {
  "Leather Crossbody Bag": ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600", "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600"],
  "Designer Tote Bag": ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600", "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600"],
  "Evening Clutch Purse": ["https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600", "https://images.unsplash.com/photo-1564422170194-896b89110ef8?w=600"],
  "Canvas Shoulder Bag": ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600", "https://images.unsplash.com/photo-1590739225017-e80c1f7c8c24?w=600"],
  "Luxury Handbag": ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600", "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600"],
  "Smart Fitness Watch": ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600", "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"],
  "Classic Leather Watch": ["https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600", "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=600"],
  "Digital Sports Watch": ["https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600", "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600"],
  "Luxury Gold Watch": ["https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600", "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600"],
  "Minimalist Watch": ["https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600", "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=600"],
  "Wireless Mouse": ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600", "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600"],
  "Mechanical Keyboard": ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600", "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600"],
  "Laptop Stand": ["https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600", "https://images.unsplash.com/photo-1631465804812-1f0e3c0ac8d2?w=600"],
  "USB-C Hub": ["https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600", "https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=600"],
  "Webcam HD": ["https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=600", "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=600"],
  "Phone Case": ["https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600", "https://images.unsplash.com/photo-1585789575825-9e5c7c5e8b3f?w=600"],
  "Wireless Charger": ["https://images.unsplash.com/photo-1591290619762-d2c9e0a4e6e8?w=600", "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600"],
  "Power Bank 20000mAh": ["https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600", "https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=600"],
  "Bluetooth Earbuds": ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600", "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=600"],
  "Screen Protector": ["https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600", "https://images.unsplash.com/photo-1585789575825-9e5c7c5e8b3f?w=600"],
  "Smartphone Pro": ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600", "https://images.unsplash.com/photo-1592286927505-4fd4d3d4ef9f?w=600"],
  "Budget Phone": ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600", "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600"],
  "Gaming Phone": ["https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600", "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600"],
  "5G Smartphone": ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600", "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600"],
  "Flip Phone": ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600", "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600"],
  "Matte Lipstick Set": ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600", "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=600"],
  "Face Makeup Kit": ["https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600", "https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=600"],
  "Eye Shadow Palette": ["https://images.unsplash.com/photo-1583241800698-c318c76ca7e8?w=600", "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600"],
  "Foundation & Concealer": ["https://images.unsplash.com/photo-1631730486572-226d1f595b68?w=600", "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600"],
  "Makeup Brush Set": ["https://images.unsplash.com/photo-1583241800698-c318c76ca7e8?w=600", "https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=600"],
  "Floral Perfume 50ml": ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=600", "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600"],
  "Men's Cologne": ["https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600", "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600"],
  "Luxury Perfume Set": ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=600", "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600"],
  "Fresh Citrus Scent": ["https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600", "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600"],
  "Evening Perfume": ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=600", "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600"],
  "Sterling Silver Necklace": ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600", "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600"],
  "Gold Plated Earrings": ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600", "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600"],
  "Diamond Ring": ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600", "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600"],
  "Pearl Bracelet": ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600", "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600"],
  "Jewelry Gift Set": ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600", "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600"],
  "Cotton T-Shirt Pack": ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600", "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600"],
  "Denim Jeans": ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=600", "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600"],
  "Formal Dress Shirt": ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600", "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600"],
  "Casual Hoodie": ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600", "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600"],
  "Leather Jacket": ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600", "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=600"],
  "Summer Dress": ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600", "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600"],
  "Skinny Jeans": ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600", "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=600"],
  "Blouse Top": ["https://images.unsplash.com/photo-1564257577-d18b7c1a9b78?w=600", "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=600"],
  "Cardigan Sweater": ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600", "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=600"],
  "Maxi Skirt": ["https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600", "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=600"],
  "Sneakers Casual": ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600", "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600"],
  "High Heels": ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600", "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=600"],
  "Sandals Summer": ["https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600", "https://images.unsplash.com/photo-1562183241-b937e95585b6?w=600"],
  "Boots Ankle": ["https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600", "https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=600"],
  "Loafers Leather": ["https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600", "https://images.unsplash.com/photo-1614252368530-9e0f6919a7e3?w=600"],
  "Cotton T-Shirt Pack": ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600", "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600"],
  "Denim Jeans": ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=600", "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600"],
  "Formal Dress Shirt": ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600", "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600"],
  "Casual Hoodie": ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600", "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600"],
  "Leather Jacket": ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600", "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=600"],
  "Summer Dress": ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600", "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600"],
  "Skinny Jeans": ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600", "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=600"],
  "Blouse Top": ["https://images.unsplash.com/photo-1564257577-d18b7c1a9b78?w=600", "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=600"],
  "Cardigan Sweater": ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600", "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=600"],
  "Maxi Skirt": ["https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600", "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=600"],
  "Yoga Mat Premium": ["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600", "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600"],
  "Resistance Bands Set": ["https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600", "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600"],
  "Dumbbell Set": ["https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600", "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600"],
  "Running Shoes": ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600", "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600"],
  "Sports Water Bottle": ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600", "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600"],
  "Building Blocks Set": ["https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600", "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600"],
  "Remote Control Car": ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600", "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=600"],
  "Doll House": ["https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=600", "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=600"],
  "Educational Tablet": ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600", "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600"],
  "Puzzle Set": ["https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600", "https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=600"]
};

async function updateWithRealImages() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB\n');

    const productSchema = new mongoose.Schema({
      name: String,
      images: [String]
    }, { timestamps: true });

    const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

    let updated = 0;

    for (const [productName, images] of Object.entries(imageMap)) {
      const result = await Product.updateMany(
        { name: productName },
        { $set: { images: images } }
      );

      if (result.modifiedCount > 0) {
        console.log(`✅ Updated: ${productName}`);
        updated += result.modifiedCount;
      }
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

updateWithRealImages();
