const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://empathizer:2491p100@cluster0.agfqdlm.mongodb.net/seveneleven';

async function testAPI() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const Order = mongoose.model('Order', new mongoose.Schema({
      userId: mongoose.Schema.Types.ObjectId,
      items: [{
        productId: mongoose.Schema.Types.ObjectId,
        productName: String,
        productImage: String,
        sellerId: mongoose.Schema.Types.ObjectId,
        quantity: Number,
        price: Number
      }],
      createdAt: Date
    }));
    
    const userId = new mongoose.Types.ObjectId('69ad9daa501cec22124a5a0a');
    const orders = await Order.find({ 'items.sellerId': userId })
      .populate('userId', 'name email')
      .sort('-createdAt');
    
    console.log('\nAPI Response (what frontend receives):');
    console.log(JSON.stringify(orders[0], null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testAPI();
