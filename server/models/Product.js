const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  price: {
    type: Number,
    required: [true, 'Selling price is required'],
    min: 0
  },
  buyingPrice: {
    type: Number,
    min: 0,
    default: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  images: [{
    type: String
  }],
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: 0,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  sold: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Performance indexes
productSchema.index({ sellerId: 1, createdAt: -1 });
productSchema.index({ categoryId: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ sellerId: 1, featured: 1 });
productSchema.index({ price: 1 });
productSchema.index({ stock: 1 });

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
