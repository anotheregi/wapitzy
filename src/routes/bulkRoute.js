const router = require("express").Router();
const bulkController = require("../controllers/bulkController");
const apikeyValidator = require("../middlewares/apikeyValidator");
const { bulkMessageLimiter } = require("../middlewares/rateLimiter");

// Dedicated bulk messaging endpoint
router.post("/send", [apikeyValidator, bulkMessageLimiter], bulkController.sendBulkMessage);

module.exports = router;
