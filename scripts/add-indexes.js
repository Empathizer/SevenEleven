const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://empathizer:2491p100@cluster0.agfqdlm.mongodb.net/seveneleven';

async function addIndexes() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Add indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ role: 1 });
    await db.collection('products').createIndex({ sellerId: 1 });
    await db.collection('products').createIndex({ categoryId: 1 });
    await db.collection('orders').createIndex({ sellerId: 1 });
    await db.collection('orders').createIndex({ customerId: 1 });
    await db.collection('sellers').createIndex({ userId: 1 });
    
    console.log('✅ Indexes created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addIndexes();
