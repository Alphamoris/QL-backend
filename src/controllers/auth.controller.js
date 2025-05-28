const authService = require('../services/auth.service');
const ApiResponse = require('../utils/apiResponse');
const { AppError } = require('../utils/errorHandler');

exports.register = async (req, res, next) => {
  try {
    const { user, token } = await authService.register(req.body);
    
    res.status(201).json(
      ApiResponse.success('User registered successfully', {
        user,
        token,
      })
    );
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    
    res.status(200).json(
      ApiResponse.success('Login successful', {
        user,
        token,
      })
    );
  } catch (error) {
    next(error);
  }
}; 