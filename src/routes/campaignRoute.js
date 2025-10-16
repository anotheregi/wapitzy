const router = require("express").Router();
const campaignController = require("../controllers/campaignController");
const { validateApiKey } = require("../middlewares/apikeyValidator");
const { generalLimiter } = require("../middlewares/rateLimiter");

// Campaign management
router.post("/", [validateApiKey, generalLimiter], campaignController.createCampaign);
router.get("/", [validateApiKey, generalLimiter], campaignController.getCampaigns);
router.get("/:campaignId", [validateApiKey, generalLimiter], campaignController.getCampaign);
router.put("/:campaignId/status", [validateApiKey, generalLimiter], campaignController.updateCampaignStatus);
router.delete("/:campaignId", [validateApiKey, generalLimiter], campaignController.deleteCampaign);

// Campaign statistics
router.get("/stats/overview", [validateApiKey, generalLimiter], campaignController.getCampaignStats);

module.exports = router;
