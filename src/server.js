const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const config = require('./config/config');
const connectDB = require('./config/database');
const routes = require('./routes');
const errorHandler = require('./middlewares/error.middleware');
const logger = require('./utils/logger');
const Subscription = require('./models/subscription.model');

// Uncaught exception handler
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Development logging
if (config.server.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

// Routes
app.use('/api/v1', routes);

// Error handling
app.use(errorHandler);

// Start server
const PORT = config.server.port;
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${config.server.nodeEnv} mode on port ${PORT}`);
});

// Setup scheduler to check for expired subscriptions
const setupExpirationChecker = () => {
  // Check every day at midnight
  setInterval(async () => {
    try {
      const count = await Subscription.checkExpiredSubscriptions();
      logger.info(`Subscription checker: ${count} subscriptions marked as expired`);
    } catch (error) {
      logger.error('Error in subscription expiration checker:', error);
    }
  }, 24 * 60 * 60 * 1000); // 24 hours
};

setupExpirationChecker();

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
}); 