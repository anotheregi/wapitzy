const router = require("express").Router();
const contactController = require("../controllers/contactController");
const { validateApiKey } = require("../middlewares/apikeyValidator");
const { generalLimiter } = require("../middlewares/rateLimiter");

// Contact list management
router.post("/", [validateApiKey, generalLimiter], contactController.createContactList);
router.get("/", [validateApiKey, generalLimiter], contactController.getContactLists);
router.get("/:listId", [validateApiKey, generalLimiter], contactController.getContactList);
router.put("/:listId", [validateApiKey, generalLimiter], contactController.updateContactList);
router.delete("/:listId", [validateApiKey, generalLimiter], contactController.deleteContactList);

// Import contacts from CSV
router.post("/import/csv", [validateApiKey, generalLimiter], contactController.importContactsFromCSV);

// Get contact phones for bulk messaging
router.get("/:listId/phones", [validateApiKey, generalLimiter], contactController.getContactPhones);

module.exports = router;
