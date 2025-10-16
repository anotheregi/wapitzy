require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const nodeCleanup = require("node-cleanup");
const routes = require("./src/routes/index.js");
const whatsappService = require("./src/services/whatsappService.js");
const cors = require("cors");
const { cleanupAllSessions } = require("./src/services/whatsappService");
const { syncDatabase } = require("./src/models");
const errorHandler = require("./src/middlewares/errorHandler");
const logger = require("./src/utils/logger");

const app = express();

const PORT = process.env.PORT || 3000;
const HOST = process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' })); // Increase limit for file uploads
app.use("/", routes);

// Global error handler (must be last)
app.use(errorHandler);

const listenerCallback = async function () {
  try {
    // Sync database first
    await syncDatabase();

    // Initialize WhatsApp service
    whatsappService.init();

    logger.info({
      msg: "Server started successfully",
      host: HOST,
      port: PORT,
      env: process.env.NODE_ENV,
    });
  } catch (error) {
    logger.error({
      msg: "Failed to start server",
      error: error.message,
      stack: error.stack
    });
    process.exit(1);
  }
};

app.listen(PORT, HOST, listenerCallback);

// Menambahkan handler untuk graceful shutdown
nodeCleanup((exitCode, signal) => {
  logger.info({
    msg: "Cleaning up before shutdown",
    exitCode,
    signal,
  });

  cleanupAllSessions()
    .then(() => {
      logger.info({
        msg: "All sessions cleaned up successfully",
      });
      process.exit(exitCode);
    })
    .catch((error) => {
      logger.error({
        msg: "Error during cleanup",
        error: error.message,
        stack: error.stack,
      });
      process.exit(1);
    });

  // Mencegah exit langsung, menunggu cleanup selesai
  nodeCleanup.uninstall();
  return false;
});

module.exports = app;
