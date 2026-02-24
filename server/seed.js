require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Seller = require('./models/Seller');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Banner = require('./models/Banner');
const connectDB = require('./config/db');

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Seller.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Banner.deleteMany();

    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@esellerstore.com',
      password: 'admin123',
      role: 'admin',
      status: 'active'
    });

    // Create seller users
    const seller1 = await User.create({
      name: 'StyleHub Store',
      email: 'seller@esellerstore.com',
      password: 'seller123',
      role: 'seller',
      status: 'active',
      walletBalance: 1250.50,
      totalEarnings: 3500.00,
      totalWithdrawn: 2249.50
    });

    const seller2 = await User.create({
      name: 'GlamGlow Beauty',
      email: 'glamglow@esellerstore.com',
      password: 'seller123',
      role: 'seller',
      status: 'active',
      walletBalance: 890.25,
      totalEarnings: 1890.25,
      totalWithdrawn: 1000.00
    });

    // Create seller profiles
    await Seller.create({
      userId: seller1._id,
      storeName: 'StyleHub',
      storeDescription: 'Premium fashion and accessories',
      idType: 'CNIC',
      idNumber: '12345-1234567-1',
      idImage: 'https://via.placeholder.com/400',
      address: '123 Fashion Street, New York, NY',
      status: 'approved'
    });

    await Seller.create({
      userId: seller2._id,
      storeName: 'GlamGlow Beauty',
      storeDescription: 'Your one-stop beauty shop',
      idType: 'Passport',
      idNumber: 'AB1234567',
      idImage: 'https://via.placeholder.com/400',
      address: '456 Beauty Ave, Los Angeles, CA',
      status: 'approved'
    });

    // Create customer
    await User.create({
      name: 'Sarah Johnson',
      email: 'customer@esellerstore.com',
      password: 'customer123',
      role: 'customer',
      status: 'active'
    });

    console.log('Created users');

    // Create categories
    const categories = await Category.insertMany([
      { name: 'Jewelry', slug: 'jewelry', image: 'https://images.unsplash.com/photo-1515562141589-67f0d569b6c4?w=400' },
      { name: 'Fashion', slug: 'fashion', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400' },
      { name: "Men's Apparel", slug: 'mens-apparel', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
      { name: "Women's Apparel", slug: 'womens-apparel', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400' },
      { name: 'Shoes', slug: 'shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
      { name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400' },
      { name: 'Beauty', slug: 'beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400' }
    ]);

    console.log('Created categories');

    // Create products
    await Product.insertMany([
      {
        name: 'Diamond Pendant Necklace',
        description: 'Elegant diamond pendant necklace crafted in 18K gold',
        price: 129.99,
        originalPrice: 199.99,
        categoryId: categories[0]._id,
        sellerId: seller1._id,
        images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600'],
        stock: 25,
        rating: 4.8,
        reviewCount: 156,
        sold: 342,
        featured: true
      },
      {
        name: 'Floral Summer Dress',
        description: 'Light and airy floral summer dress made from premium cotton',
        price: 59.99,
        originalPrice: 89.99,
        categoryId: categories[1]._id,
        sellerId: seller1._id,
        images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600'],
        stock: 100,
        rating: 4.5,
        reviewCount: 234,
        sold: 567,
        featured: true
      },
      {
        name: 'Running Sneakers Pro',
        description: 'High-performance running shoes with advanced cushioning',
        price: 89.99,
        originalPrice: 129.99,
        categoryId: categories[4]._id,
        sellerId: seller1._id,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
        stock: 150,
        rating: 4.8,
        reviewCount: 567,
        sold: 1234,
        featured: true
      },
      {
        name: 'Vitamin C Serum',
        description: 'Brightening vitamin C serum with hyaluronic acid',
        price: 24.99,
        originalPrice: 39.99,
        categoryId: categories[6]._id,
        sellerId: seller2._id,
        images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600'],
        stock: 500,
        rating: 4.7,
        reviewCount: 892,
        sold: 2341,
        featured: true
      },
      {
        name: 'Designer Sunglasses',
        description: 'UV400 protection designer sunglasses with polarized lenses',
        price: 34.99,
        originalPrice: 54.99,
        categoryId: categories[5]._id,
        sellerId: seller1._id,
        images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600'],
        stock: 300,
        rating: 4.3,
        reviewCount: 421,
        sold: 987,
        featured: true
      }
    ]);

    console.log('Created products');

    // Create banners
    await Banner.insertMany([
      {
        title: 'Mega Sale - Up to 70% Off',
        subtitle: 'Shop the biggest deals of the season',
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200',
        link: '/products',
        isActive: true
      },
      {
        title: 'New Arrivals in Beauty',
        subtitle: 'Discover the latest skincare essentials',
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200',
        link: '/products?category=beauty',
        isActive: true
      }
    ]);

    console.log('Created banners');
    console.log('\n✅ Database seeded successfully!');
    console.log('\nDefault credentials:');
    console.log('Admin: admin@esellerstore.com / admin123');
    console.log('Seller: seller@esellerstore.com / seller123');
    console.log('Customer: customer@esellerstore.com / customer123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
