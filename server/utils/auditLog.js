const AdminAuditLog = require('../models/AdminAuditLog');

exports.logAdminAction = async (adminId, action, targetId = null, targetModel = null, details = {}, ipAddress = null) => {
  try {
    await AdminAuditLog.create({
      adminId,
      action,
      targetId,
      targetModel,
      details,
      ipAddress
    });
  } catch (error) {
    console.error('Audit log error:', error);
  }
};
