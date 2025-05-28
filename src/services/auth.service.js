const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { AppError } = require('../utils/errorHandler');
const config = require('../config/config');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

exports.register = async (userData) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new AppError('Email already in use', 400);
  }

  // Create new user
  const user = await User.create(userData);

  // Generate JWT token
  const token = generateToken(user._id);

  // Remove password from output
  user.password = undefined;

  return { user, token };
};

exports.login = async (email, password) => {
  // Find user and select password
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Check if password is correct
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new AppError('Invalid email or password', 401);
  }

  // Generate JWT token
  const token = generateToken(user._id);

  // Remove password from output
  user.password = undefined;

  return { user, token };
}; 