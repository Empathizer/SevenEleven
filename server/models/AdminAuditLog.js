const mongoose = require('mongoose');

const adminAuditLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    trim: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId
  },
  targetModel: {
    type: String,
    trim: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: String
}, {
  timestamps: true
});

adminAuditLogSchema.index({ adminId: 1, createdAt: -1 });
adminAuditLogSchema.index({ action: 1 });

module.exports = mongoose.model('AdminAuditLog', adminAuditLogSchema);
