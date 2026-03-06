const mongoose = require('mongoose');

async function addIndexes() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/esellerstore';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;

    // Product indexes
    await db.collection('products').createIndex({ sellerId: 1 });
    await db.collection('products').createIndex({ categoryId: 1 });
    await db.collection('products').createIndex({ createdAt: -1 });
    await db.collection('products').createIndex({ name: 'text', description: 'text' });
    console.log('✓ Product indexes created');

    // Order indexes
    await db.collection('orders').createIndex({ userId: 1 });
    await db.collection('orders').createIndex({ sellerId: 1 });
    await db.collection('orders').createIndex({ createdAt: -1 });
    await db.collection('orders').createIndex({ status: 1 });
    console.log('✓ Order indexes created');

    // Seller indexes
    try {
      await db.collection('sellers').createIndex({ userId: 1 });
    } catch (e) {
      if (e.code !== 86) throw e;
    }
    await db.collection('sellers').createIndex({ status: 1 });
    console.log('✓ Seller indexes created');

    // User indexes
    try {
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
    } catch (e) {
      if (e.code !== 86) throw e;
    }
    await db.collection('users').createIndex({ role: 1 });
    console.log('✓ User indexes created');

    console.log('\n✅ All indexes created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addIndexes();
