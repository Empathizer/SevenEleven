import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  guestName: String,
  guestEmail: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  messages: [{
    text: String,
    sender: {
      type: String,
      enum: ['guest', 'admin'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  }
}, {
  timestamps: true
});

export default mongoose.models.Chat || mongoose.model('Chat', chatSchema);
