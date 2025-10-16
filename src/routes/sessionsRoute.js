const router = require("express").Router();
const { validateApiKey } = require("./../middlewares/apikeyValidator.js");
const sessionController = require("../controllers/sessionController.js");

router.get("/:sessionId", validateApiKey, sessionController.status);
router.post("/:sessionId", validateApiKey, sessionController.create);
router.post("/:sessionId/logout", validateApiKey, sessionController.logout);
router.get("/:sessionId/groups", validateApiKey, sessionController.getGroups);

module.exports = router;
