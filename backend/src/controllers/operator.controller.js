const operatorService = require('../services/operator.service');
const { successResponse } = require('../utils/response');

const getOperatorTrips = async (req, res, next) => {
  try {
    const trips = await operatorService.getOperatorTrips(req.user._id, req.user.role);
    return successResponse(res, trips, 'Operator trips retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const getTripManifest = async (req, res, next) => {
  try {
    const manifestData = await operatorService.getTripManifest(
      req.params.tripId,
      req.user._id,
      req.user.role
    );
    return successResponse(res, manifestData, 'Trip passenger manifest retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOperatorTrips,
  getTripManifest
};
