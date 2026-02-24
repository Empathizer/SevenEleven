const mongoose = require('mongoose');

const supportMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: String,
  userEmail: String,
  userRole: String,
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'replied', 'closed'],
    default: 'pending'
  },
  adminReply: String
}, {
  timestamps: true
});

module.exports = mongoose.models.SupportMessage || mongoose.model('SupportMessage', supportMessageSchema);
