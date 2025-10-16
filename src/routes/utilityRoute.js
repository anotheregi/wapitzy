const router = require("express").Router();
const { validateApiKey } = require("../middlewares/apikeyValidator.js");
const utilityController = require("../controllers/utilityController.js");

router.get("/groups/:sessionId", validateApiKey, utilityController.getGroups);
router.post("/check-number", validateApiKey, utilityController.checkNumber);

// TODO: Endpoint lain untuk utility/helper
// router.get("/contacts/:sessionId", apikeyValidator, utilityController.getContacts);
// router.get("/profile/:sessionId", apikeyValidator, utilityController.getProfile);

module.exports = router;
