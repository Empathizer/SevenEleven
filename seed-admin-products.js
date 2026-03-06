const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load environment variables
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

const adminProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "Premium noise-cancelling wireless headphones with 30-hour battery life and superior sound quality.",
    price: 79.99,
    stock: 100,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop"]
  },
  {
    name: "Smart Watch Pro",
    description: "Advanced fitness tracker with heart rate monitor, GPS, and waterproof design.",
    price: 199.99,
    stock: 75,
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop"]
  },
  {
    name: "Laptop Backpack",
    description: "Durable water-resistant backpack with USB charging port and multiple compartments.",
    price: 49.99,
    stock: 150,
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop"]
  },
  {
    name: "Portable Power Bank 20000mAh",
    description: "High-capacity power bank with fast charging and dual USB ports.",
    price: 34.99,
    stock: 200,
    images: ["https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop"]
  },
  {
    name: "Wireless Gaming Mouse",
    description: "Ergonomic gaming mouse with RGB lighting and programmable buttons.",
    price: 59.99,
    stock: 120,
    images: ["https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&h=600&fit=crop"]
  },
  {
    name: "USB-C Hub Adapter",
    description: "7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and power delivery.",
    price: 39.99,
    stock: 180,
    images: ["https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600&h=600&fit=crop"]
  },
  {
    name: "Mechanical Keyboard RGB",
    description: "Professional mechanical keyboard with customizable RGB backlighting.",
    price: 89.99,
    stock: 90,
    images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop"]
  },
  {
    name: "Webcam HD 1080p",
    description: "Full HD webcam with auto-focus and built-in microphone for video calls.",
    price: 69.99,
    stock: 110,
    images: ["https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=600&h=600&fit=crop"]
  },
  {
    name: "Phone Stand Adjustable",
    description: "Aluminum alloy phone holder with 360-degree rotation and adjustable height.",
    price: 24.99,
    stock: 250,
    images: ["https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop"]
  },
  {
    name: "LED Desk Lamp",
    description: "Modern LED desk lamp with touch control and adjustable brightness levels.",
    price: 44.99,
    stock: 140,
    images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop"]
  },
  {
    name: "Bluetooth Speaker Portable",
    description: "Waterproof portable speaker with 360-degree sound and 12-hour battery.",
    price: 54.99,
    stock: 160,
    images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop"]
  },
  {
    name: "Wireless Charger Pad",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices.",
    price: 29.99,
    stock: 220,
    images: ["https://images.unsplash.com/photo-1591290619762-c588f0e8e23f?w=600&h=600&fit=crop"]
  },
  {
    name: "Cable Organizer Set",
    description: "Complete cable management solution with clips, sleeves, and ties.",
    price: 19.99,
    stock: 300,
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop"]
  },
  {
    name: "Screen Protector Tempered Glass",
    description: "Premium tempered glass screen protector with anti-scratch coating.",
    price: 14.99,
    stock: 350,
    images: ["https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop"]
  },
  {
    name: "Laptop Cooling Pad",
    description: "Ergonomic cooling pad with 6 fans and adjustable height settings.",
    price: 39.99,
    stock: 130,
    images: ["https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&h=600&fit=crop"]
  }
];

async function seedAdminProducts() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB\n');

    const Product = require('./server/models/Product');
    const Category = require('./server/models/Category');

    // Get or create Electronics category
    let category = await Category.findOne({ name: 'Electronics' }).maxTimeMS(30000);
    if (!category) {
      category = await Category.create({
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and accessories'
      });
      console.log('✅ Created Electronics category\n');
    }

    // Delete existing admin products
    await Product.deleteMany({ sellerId: null });
    console.log('🗑️  Cleared existing admin products\n');

    // Add new admin products
    for (const productData of adminProducts) {
      const product = await Product.create({
        ...productData,
        categoryId: category._id,
        sellerId: null,
        buyingPrice: 0,
        featured: Math.random() > 0.5
      });
      console.log(`✅ Added: ${product.name} - $${product.price}`);
    }

    console.log(`\n✅ Successfully added ${adminProducts.length} admin products!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedAdminProducts();
