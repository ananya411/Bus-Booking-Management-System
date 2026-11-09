const auditLogService = require('../services/auditLog.service');
const { successResponse } = require('../utils/response');

const getAuditLogs = async (req, res, next) => {
  try {
    const { logs, pagination } = await auditLogService.getAuditLogs(req.query);
    return successResponse(res, logs, 'Audit logs retrieved successfully', 200, pagination);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAuditLogs
};
