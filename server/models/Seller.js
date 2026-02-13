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
  rejectionReason: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Seller', sellerSchema);
