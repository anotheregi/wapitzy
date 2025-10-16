const { body, validationResult } = require('express-validator');
const logger = require('../utils/logger');

const validateApiKey = function (req, res, next) {
  try {
    const authHeader = (req.headers.authorization || "").split(" ").pop();
    const apikey = req.header("x-api-key");

    const response = {
      success: false,
      message: "UNAUTHORIZED",
      error: {
        message: "UNAUTHORIZED",
        code: 401,
        ip: req.ip,
        timestamp: new Date().toISOString(),
      },
    };

    if (!authHeader && !apikey) {
      logger.warn({
        msg: 'Unauthorized access attempt - no API key provided',
        ip: req.ip,
        url: req.url,
        method: req.method
      });
      return res.status(401).json(response);
    }

    if (apikey && apikey !== process.env.API_KEY) {
      logger.warn({
        msg: 'Unauthorized access attempt - invalid API key',
        ip: req.ip,
        url: req.url,
        method: req.method
      });
      return res.status(401).json(response);
    }

    // Sanitize input data
    if (req.body) {
      // Basic XSS prevention - remove script tags
      const sanitizeString = (str) => {
        if (typeof str !== 'string') return str;
        return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      };

      const sanitizeObject = (obj) => {
        for (let key in obj) {
          if (typeof obj[key] === 'string') {
            obj[key] = sanitizeString(obj[key]);
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            sanitizeObject(obj[key]);
          }
        }
      };

      sanitizeObject(req.body);
    }

    next();
  } catch (error) {
    logger.error({
      msg: 'Error in API key validation',
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

// Validation middleware for specific routes
const validateCampaignInput = [
  body('name').trim().isLength({ min: 1, max: 255 }).withMessage('Name is required and must be less than 255 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('sender').trim().isLength({ min: 1 }).withMessage('Sender is required'),
  body('message').trim().isLength({ min: 1 }).withMessage('Message is required'),
  body('receivers').isArray({ min: 1 }).withMessage('At least one receiver is required'),
  body('receivers.*').isString().withMessage('Each receiver must be a string'),
  body('file').optional().isURL().withMessage('File must be a valid URL'),
  body('viewOnce').optional().isBoolean().withMessage('viewOnce must be a boolean'),
  body('delay').optional().isInt({ min: 500, max: 5000 }).withMessage('Delay must be between 500 and 5000'),
  body('scheduled_at').optional().isISO8601().withMessage('Scheduled date must be a valid ISO date'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

const validateContactListInput = [
  body('name').trim().isLength({ min: 1, max: 255 }).withMessage('Name is required and must be less than 255 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('contacts').isArray().withMessage('Contacts must be an array'),
  body('contacts.*.name').optional().trim().isLength({ max: 255 }).withMessage('Contact name must be less than 255 characters'),
  body('contacts.*.phone').isMobilePhone().withMessage('Contact phone must be a valid phone number'),
  body('contacts.*.tags').optional().isArray().withMessage('Tags must be an array'),
  body('contacts.*.tags.*').isString().withMessage('Each tag must be a string'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

module.exports = {
  validateApiKey,
  validateCampaignInput,
  validateContactListInput
};
