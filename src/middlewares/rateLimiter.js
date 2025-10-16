const rateLimit = require('express-rate-limit');

// Rate limiter untuk bulk messaging
const bulkMessageLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many bulk messages, please try again later.',
    error: {
      code: 429,
      message: 'RATE_LIMIT_EXCEEDED',
      retryAfter: '15 minutes'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter untuk general API calls
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
    error: {
      code: 429,
      message: 'RATE_LIMIT_EXCEEDED',
      retryAfter: '15 minutes'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  bulkMessageLimiter,
  generalLimiter
};
