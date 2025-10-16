const router = require("express").Router();
const campaignController = require("../controllers/campaignController");
const apikeyValidator = require("../middlewares/apikeyValidator");
const { generalLimiter } = require("../middlewares/rateLimiter");

// Campaign management
router.post("/", [apikeyValidator, generalLimiter], campaignController.createCampaign);
router.get("/", [apikeyValidator, generalLimiter], campaignController.getCampaigns);
router.get("/:campaignId", [apikeyValidator, generalLimiter], campaignController.getCampaign);
router.put("/:campaignId/status", [apikeyValidator, generalLimiter], campaignController.updateCampaignStatus);
router.delete("/:campaignId", [apikeyValidator, generalLimiter], campaignController.deleteCampaign);

// Campaign statistics
router.get("/stats/overview", [apikeyValidator, generalLimiter], campaignController.getCampaignStats);

module.exports = router;
