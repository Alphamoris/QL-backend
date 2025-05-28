const winston = require('winston');
const config = require('../config/config');

const { format, createLogger, transports } = winston;
const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  level: config.logging.level,
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
      ),
    }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

// If we're in production, log only to console to reduce I/O
if (config.server.nodeEnv === 'production') {
  logger.transports.forEach((t) => {
    if (t instanceof transports.File) {
      t.silent = true;
    }
  });
}

module.exports = logger; 