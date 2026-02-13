const mongoose = require('mongoose');

const walletTransactionSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['deposit', 'earning', 'withdrawal', 'adjustment'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  note: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WalletTransaction', walletTransactionSchema);
