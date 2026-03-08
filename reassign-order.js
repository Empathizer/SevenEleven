const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://empathizer:2491p100@cluster0.agfqdlm.mongodb.net/seveneleven';

async function reassignOrder() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const Order = mongoose.model('Order', new mongoose.Schema({
      items: [{
        sellerId: mongoose.Schema.Types.ObjectId,
        productName: String,
        quantity: Number,
        price: Number
      }]
    }));
    
    console.log('\nWhich seller should own this order?');
    console.log('Enter the seller ID from the list above:');
    console.log('\nExample: node reassign-order.js 699de75a302b0b5fecd0e278');
    
    const newSellerId = process.argv[2];
    if (!newSellerId) {
      console.log('\nUsage: node reassign-order.js <seller_id>');
      process.exit(0);
    }
    
    const result = await Order.updateOne(
      { _id: '69adce1abbe532305b51b4c8' },
      { $set: { 'items.$[].sellerId': new mongoose.Types.ObjectId(newSellerId) } }
    );
    
    console.log('\nOrder reassigned!');
    console.log('Modified:', result.modifiedCount);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

reassignOrder();
