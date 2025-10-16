const router = require("express").Router();
const messageController = require("../controllers/messageController");
const { validateApiKey } = require("../middlewares/apikeyValidator");
const jsonResponse = require("../middlewares/jsonResponse");

// Endpoint untuk mengirim pesan (teks & media)
router.post("/send", [validateApiKey], messageController.sendMessage);

// New mention route
router.post(
  "/mention",
  [validateApiKey],
  messageController.sendMentionMessage
);

module.exports = router;
