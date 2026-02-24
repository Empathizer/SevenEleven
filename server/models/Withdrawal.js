const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sellerName: String,
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminNote: String
}, {
  timestamps: true
});

module.exports = mongoose.models.Withdrawal || mongoose.model('Withdrawal', withdrawalSchema);
