const router = require("express").Router();
const bulkController = require("../controllers/bulkController");
const { validateApiKey } = require("../middlewares/apikeyValidator");
const { bulkMessageLimiter } = require("../middlewares/rateLimiter");

// Dedicated bulk messaging endpoint
router.post("/send", [validateApiKey, bulkMessageLimiter], bulkController.sendBulkMessage);

module.exports = router;
