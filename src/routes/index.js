const router = require("express").Router();
const sessionsRoute = require("./sessionsRoute.js");
const messageRoute = require("./messageRoute.js");
const utilityRoute = require("./utilityRoute.js");
const campaignRoute = require("./campaignRoute.js");
const contactRoute = require("./contactRoute.js");
const swaggerRoute = require("./swagger");
const healthRoute = require("./health.js");

// Health check routes
router.use("/health", healthRoute);

// API routes
router.use("/sessions", sessionsRoute); // Manajemen Sesi
router.use("/messages", messageRoute); // Pengiriman Pesan
router.use("/utility", utilityRoute); // Utilitas & Helper
router.use("/campaigns", campaignRoute); // Campaign management
router.use("/contacts", contactRoute); // Contact list management

// Swagger documentation - pindah ke /docs
router.use("/", swaggerRoute); // Dokumentasi API

// Wildcard route untuk 404
router.all("*", function (req, res) {
  res.status(404).json({
    success: false,
    message: "Not Found",
  });
});

module.exports = router;
