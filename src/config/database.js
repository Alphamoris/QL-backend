
const mongoose = require('mongoose');
const config = require('./config');
const logger = require('../utils/logger');

mongoose.Promise = global.Promise;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.database.uri, {
      serverSelectionTimeoutMS: 5000
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    logger.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB; 