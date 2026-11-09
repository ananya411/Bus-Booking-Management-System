const User = require('../models/user.model');

const getAllUsers = async (filter = {}) => {
  const query = {};
  if (filter.role) {
    query.role = filter.role;
  }
  if (filter.search) {
    query.$or = [
      { name: { $regex: filter.search, $options: 'i' } },
      { email: { $regex: filter.search, $options: 'i' } }
    ];
  }

  return User.find(query).select('-password').sort({ createdAt: -1 });
};

const updateUserRole = async (userId, newRole) => {
  const allowedRoles = ['customer', 'admin', 'operator'];
  if (!allowedRoles.includes(newRole)) {
    const error = new Error(`Invalid role. Allowed roles: ${allowedRoles.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  user.role = newRole;
  await user.save();

  return User.findById(userId).select('-password');
};

module.exports = {
  getAllUsers,
  updateUserRole
};
