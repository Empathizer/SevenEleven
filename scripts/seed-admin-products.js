// Run this script to add 5 admin products
// node SevenEleven/scripts/seed-admin-products.js

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://empathizer:2491p100@cluster0.agfqdlm.mongodb.net/seveneleven';

const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium noise-cancelling headphones with 30-hour battery life',
    price: 79.99,
    buyingPrice: 0,
    stock: 100,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
    sellerId: null
  },
  {
    name: 'Smart Watch Pro',
    description: 'Fitness tracker with heart rate monitor and GPS',
    price: 199.99,
    buyingPrice: 0,
    stock: 75,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
    sellerId: null
  },
  {
    name: 'Laptop Backpack',
    description: 'Water-resistant travel backpack with USB charging port',
    price: 49.99,
    buyingPrice: 0,
    stock: 150,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'],
    sellerId: null
  },
  {
    name: 'Power Bank 20000mAh',
    description: 'Fast charging portable battery with dual USB ports',
    price: 34.99,
    buyingPrice: 0,
    stock: 200,
    images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600'],
    sellerId: null
  },
  {
    name: 'Gaming Mouse RGB',
    description: 'Programmable gaming mouse with 16000 DPI',
    price: 59.99,
    buyingPrice: 0,
    stock: 120,
    images: ['https://images.unsplash.com/photo-1527814050087-3793815479db?w=600'],
    sellerId: null
  },
  {
    name: 'USB-C Hub Adapter',
    description: 'Multi-port USB hub with HDMI and SD card reader',
    price: 39.99,
    buyingPrice: 0,
    stock: 180,
    images: ['https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600'],
    sellerId: null
  },
  {
    name: 'Mechanical Keyboard',
    description: 'RGB backlit gaming keyboard with blue switches',
    price: 89.99,
    buyingPrice: 0,
    stock: 90,
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600'],
    sellerId: null
  },
  {
    name: 'Webcam HD 1080p',
    description: 'High definition webcam with auto-focus',
    price: 69.99,
    buyingPrice: 0,
    stock: 110,
    images: ['https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=600'],
    sellerId: null
  },
  {
    name: 'Phone Stand Adjustable',
    description: 'Aluminum phone holder with 360-degree rotation',
    price: 24.99,
    buyingPrice: 0,
    stock: 250,
    images: ['https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600'],
    sellerId: null
  },
  {
    name: 'LED Desk Lamp',
    description: 'Dimmable LED desk light with touch control',
    price: 44.99,
    buyingPrice: 0,
    stock: 140,
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600'],
    sellerId: null
  },
  {
    name: 'Bluetooth Speaker',
    description: 'Portable wireless speaker with 12-hour battery',
    price: 54.99,
    buyingPrice: 0,
    stock: 160,
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600'],
    sellerId: null
  },
  {
    name: 'Wireless Charger Pad',
    description: 'Fast wireless charging pad for smartphones',
    price: 29.99,
    buyingPrice: 0,
    stock: 220,
    images: ['https://images.unsplash.com/photo-1591290619762-c588f0e8e23f?w=600'],
    sellerId: null
  },
  {
    name: 'Cable Organizer Set',
    description: 'Cable management kit with clips and ties',
    price: 19.99,
    buyingPrice: 0,
    stock: 300,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'],
    sellerId: null
  },
  {
    name: 'Screen Protector Glass',
    description: 'Tempered glass protector with anti-fingerprint',
    price: 14.99,
    buyingPrice: 0,
    stock: 350,
    images: ['https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600'],
    sellerId: null
  },
  {
    name: 'Laptop Cooling Pad',
    description: 'Adjustable cooling stand with dual fans',
    price: 39.99,
    buyingPrice: 0,
    stock: 130,
    images: ['https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600'],
    sellerId: null
  },
  {
    name: 'Portable SSD 1TB',
    description: 'External solid state drive with USB 3.2',
    price: 129.99,
    buyingPrice: 0,
    stock: 60,
    images: ['https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600'],
    sellerId: null
  },
  {
    name: 'Noise Cancelling Earbuds',
    description: 'True wireless earbuds with active noise cancellation',
    price: 149.99,
    buyingPrice: 0,
    stock: 85,
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600'],
    sellerId: null
  },
  {
    name: 'Fitness Tracker Band',
    description: 'Activity tracking smartband with sleep monitor',
    price: 79.99,
    buyingPrice: 0,
    stock: 95,
    images: ['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600'],
    sellerId: null
  },
  {
    name: 'Tablet Stand Holder',
    description: 'Adjustable tablet mount for desk or bed',
    price: 34.99,
    buyingPrice: 0,
    stock: 175,
    images: ['https://images.unsplash.com/photo-1585790050230-5dd28404f1e9?w=600'],
    sellerId: null
  },
  {
    name: 'Ring Light for Video',
    description: 'LED ring light with tripod for photography',
    price: 64.99,
    buyingPrice: 0,
    stock: 105,
    images: ['https://images.unsplash.com/photo-1598986646512-9330bcc4c0dc?w=600'],
    sellerId: null
  },
  {
    name: 'External Hard Drive 2TB',
    description: 'Portable external HDD with USB 3.0',
    price: 89.99,
    buyingPrice: 0,
    stock: 70,
    images: ['https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600'],
    sellerId: null
  },
  {
    name: 'Wireless Gaming Controller',
    description: 'Bluetooth game controller for PC and mobile',
    price: 49.99,
    buyingPrice: 0,
    stock: 125,
    images: ['https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=600'],
    sellerId: null
  },
  {
    name: 'USB Microphone',
    description: 'Professional USB mic for streaming and podcasts',
    price: 99.99,
    buyingPrice: 0,
    stock: 80,
    images: ['https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600'],
    sellerId: null
  },
  {
    name: 'Monitor Stand Riser',
    description: 'Ergonomic monitor stand with storage drawer',
    price: 44.99,
    buyingPrice: 0,
    stock: 145,
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600'],
    sellerId: null
  },
  {
    name: 'Wireless Earphones Sport',
    description: 'Waterproof sports earphones with ear hooks',
    price: 39.99,
    buyingPrice: 0,
    stock: 190,
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600'],
    sellerId: null
  }
];

async function seedAdminProducts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
    const Category = mongoose.model('Category', new mongoose.Schema({}, { strict: false }));

    // Get first category
    const category = await Category.findOne();
    if (!category) {
      console.error('No category found. Please create a category first.');
      process.exit(1);
    }

    // Add categoryId to all products
    const productsWithCategory = products.map(p => ({
      ...p,
      categoryId: category._id
    }));

    // Insert products
    await Product.insertMany(productsWithCategory);
    console.log(`✅ Successfully added ${productsWithCategory.length} admin products`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedAdminProducts();
