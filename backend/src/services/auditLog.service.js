const AuditLog = require('../models/auditLog.model');

const getAuditLogs = async (filter = {}) => {
  const query = {};
  if (filter.action) query.action = filter.action;
  if (filter.resource) query.resource = filter.resource;
  if (filter.user) query.user = filter.user;

  const page = parseInt(filter.page, 10) || 1;
  const limit = parseInt(filter.limit, 10) || 50;
  const skip = (page - 1) * limit;

  const [total, logs] = await Promise.all([
    AuditLog.countDocuments(query),
    AuditLog.find(query)
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
  ]);

  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

module.exports = {
  getAuditLogs
};
