const AuditLog = require('../models/auditLog.model');

/**
 * Audit Logger Middleware Factory
 * Logs write/update/delete operations performed by users
 */
const auditLogger = (action, resource) => {
  return async (req, res, next) => {
    // Capture the original res.json to log after successful response
    const originalJson = res.json.bind(res);

    res.json = function (body) {
      if (body && body.success && req.user) {
        // Fire and forget audit log creation
        const resourceId = req.params.id || (body.data && body.data._id) || null;
        const details = {
          body: req.body,
          params: req.params,
          query: req.query
        };

        AuditLog.create({
          user: req.user._id,
          action: action || `${req.method}_${resource || 'RESOURCE'}`,
          resource: resource || 'Resource',
          resourceId: resourceId,
          details: details,
          ip: req.ip || req.connection.remoteAddress || ''
        }).catch((err) => {
          console.error('[AuditLog] Failed to record audit log:', err.message);
        });
      }

      return originalJson(body);
    };

    next();
  };
};

/**
 * Direct logging helper function
 */
const logAudit = async ({ user, action, resource, resourceId, details, ip }) => {
  try {
    await AuditLog.create({
      user,
      action,
      resource,
      resourceId,
      details,
      ip: ip || ''
    });
  } catch (err) {
    console.error('[AuditLog] Failed to record direct audit log:', err.message);
  }
};

module.exports = {
  auditLogger,
  logAudit
};
