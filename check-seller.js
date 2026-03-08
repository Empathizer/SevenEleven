const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://empathizer:2491p100@cluster0.agfqdlm.mongodb.net/seveneleven';

async function checkSeller() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const User = mongoose.model('User', new mongoose.Schema({
      email: String,
      name: String,
      role: String,
      _id: mongoose.Schema.Types.ObjectId
    }));
    
    const sellers = await User.find({ role: 'seller' }).select('_id email name');
    
    console.log('\n=== ALL SELLERS ===');
    sellers.forEach(s => {
      console.log(`ID: ${s._id.toString()}`);
      console.log(`Email: ${s.email}`);
      console.log(`Name: ${s.name}\n`);
    });
    
    console.log('Order has sellerId: 69ad9daa501cec22124a5a0a');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkSeller();
