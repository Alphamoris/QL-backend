const express = require('express');
const authRoutes = require('./auth.routes');
const planRoutes = require('./plan.routes');
const subscriptionRoutes = require('./subscription.routes');
const { AppError } = require('../utils/errorHandler');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Service is running' });
});

// API routes
router.use('/auth', authRoutes);
router.use('/plans', planRoutes);
router.use('/subscriptions', subscriptionRoutes);

// Handle undefined routes
router.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

module.exports = router; 