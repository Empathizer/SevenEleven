const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  storeName: {
    type: String,
    required: [true, 'Store name is required'],
    trim: true
  },
  storeDescription: {
    type: String,
    trim: true
  },
  idType: {
    type: String,
    enum: ['CNIC', 'Passport', 'Driving License'],
    required: [true, 'ID type is required']
  },
  idNumber: {
    type: String,
    required: [true, 'ID number is required'],
    trim: true
  },
  idImage: {
    type: String,
    required: [true, 'ID image is required']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  invitationCode: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: String,
  walletBalance: {
    type: Number,
    default: 0
  },
  pendingBalance: {
    type: Number,
    default: 0
  },
  guaranteeMoney: {
    type: Number,
    default: 0
  },
  totalRecharge: {
    type: Number,
    default: 0
  },
  totalWithdrawn: {
    type: Number,
    default: 0
  },
  creditScore: {
    type: Number,
    default: 100
  },
  viewsBase: {
    type: Number,
    default: 0
  },
  viewsInc: {
    type: Number,
    default: 0
  },
  package: {
    type: String,
    trim: true
  },
  salesman: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Seller || mongoose.model('Seller', sellerSchema);
