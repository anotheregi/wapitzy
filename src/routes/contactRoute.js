const router = require("express").Router();
const contactController = require("../controllers/contactController");
const apikeyValidator = require("../middlewares/apikeyValidator");
const { generalLimiter } = require("../middlewares/rateLimiter");

// Contact list management
router.post("/", [apikeyValidator, generalLimiter], contactController.createContactList);
router.get("/", [apikeyValidator, generalLimiter], contactController.getContactLists);
router.get("/:listId", [apikeyValidator, generalLimiter], contactController.getContactList);
router.put("/:listId", [apikeyValidator, generalLimiter], contactController.updateContactList);
router.delete("/:listId", [apikeyValidator, generalLimiter], contactController.deleteContactList);

// Import contacts from CSV
router.post("/import/csv", [apikeyValidator, generalLimiter], contactController.importContactsFromCSV);

// Get contact phones for bulk messaging
router.get("/:listId/phones", [apikeyValidator, generalLimiter], contactController.getContactPhones);

module.exports = router;
