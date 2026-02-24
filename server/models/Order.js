const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    productName: String,
    productImage: String,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    },
    buyingPrice: {
      type: Number,
      default: 0
    },
    profit: {
      type: Number,
      default: 0
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'online', 'virtual'],
    default: 'COD'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  shippingAddress: {
    type: String,
    required: [true, 'Shipping address is required']
  },
  profit: {
    type: Number,
    default: 0
  },
  pickupStatus: {
    type: String,
    enum: ['Unpicked Up', 'Picked Up'],
    default: 'Unpicked Up'
  },
  deliveryStatus: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Picked Up', 'On The Way', 'Delivered', 'Cancel'],
    default: 'Pending'
  },
  refundStatus: {
    type: String,
    enum: ['none', 'requested', 'approved', 'rejected'],
    default: 'none'
  },
  isVirtualOrder: {
    type: Boolean,
    default: false
  },
  isVirtual: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
