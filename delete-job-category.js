const mongoose = require('mongoose');
const fs = require('fs');

let MONGODB_URI;
try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const match = envContent.match(/MONGODB_URI=(.+)/);
  MONGODB_URI = match ? match[1].trim() : null;
} catch (e) {
  console.error('Error reading .env.local');
  process.exit(1);
}

async function deleteJobCategory() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB\n');

    const categorySchema = new mongoose.Schema({
      name: String,
      slug: String
    }, { timestamps: true });
    
    const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

    const result = await Category.deleteOne({ slug: 'job' });
    
    if (result.deletedCount > 0) {
      console.log('✅ Deleted "job" category');
    } else {
      console.log('⚠️  "job" category not found');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

deleteJobCategory();
