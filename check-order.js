const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://empathizer:2491p100@cluster0.agfqdlm.mongodb.net/seveneleven';

async function checkOrder() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected');
    
    const Order = mongoose.model('Order', new mongoose.Schema({
      userId: mongoose.Schema.Types.ObjectId,
      items: [{
        productId: mongoose.Schema.Types.ObjectId,
        productName: String,
        productImage: String,
        quantity: Number,
        price: Number,
        buyingPrice: Number,
        sellerId: mongoose.Schema.Types.ObjectId,
        sellerStatus: String
      }],
      status: String,
      createdAt: Date
    }));
    
    const order = await Order.findById('69adce1abbe532305b51b4c8');
    
    if (!order) {
      console.log('Order not found');
      process.exit(0);
    }
    
    console.log('\nOrder ID:', order._id.toString());
    console.log('Status:', order.status);
    console.log('Items:', order.items.length);
    
    order.items.forEach((item, idx) => {
      console.log(`\nItem ${idx + 1}:`);
      console.log('  Product Name:', item.productName || 'MISSING');
      console.log('  Product Image:', item.productImage ? 'Yes' : 'MISSING');
      console.log('  Seller ID:', item.sellerId?.toString() || 'MISSING');
      console.log('  Quantity:', item.quantity);
      console.log('  Price:', item.price);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkOrder();
