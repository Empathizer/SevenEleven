const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://empathizer:2491p100@cluster0.agfqdlm.mongodb.net/seveneleven';

async function checkUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const User = mongoose.model('User', new mongoose.Schema({
      email: String,
      _id: mongoose.Schema.Types.ObjectId
    }));
    
    const user = await User.findOne({ email: 'haniqueen9556@gmail.com' });
    
    if (!user) {
      console.log('User not found');
      process.exit(0);
    }
    
    console.log('\nYour seller ID:', user._id.toString());
    console.log('Order sellerId: 69ad9daa501cec22124a5a0a');
    console.log('Match:', user._id.toString() === '69ad9daa501cec22124a5a0a');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkUser();
