const userService = require('../services/user.service');
const { successResponse } = require('../utils/response');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers(req.query);
    return successResponse(res, users, 'Users retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const updatedUser = await userService.updateUserRole(req.params.id, role);
    return successResponse(res, updatedUser, `User role updated to ${role} successfully`, 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  updateUserRole
};
