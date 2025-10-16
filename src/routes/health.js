const router = require("express").Router();
const healthcheck = require("express-healthcheck");
const { sequelize } = require("../models");

// Basic health check
router.get("/", (req, res) =>
  res.status(200).json({
    success: true,
    message: "The server is running",
    date: new Date().toISOString(),
    version: process.env.npm_package_version,
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    platform: process.platform,
    architecture: process.arch,
    nodeVersion: process.version,
    environment: process.env.NODE_ENV,
  })
);

// Detailed health check with database connectivity
router.get("/detailed", async (req, res) => {
  const health = {
    success: true,
    message: "Health check",
    date: new Date().toISOString(),
    version: process.env.npm_package_version,
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    platform: process.platform,
    architecture: process.arch,
    nodeVersion: process.version,
    environment: process.env.NODE_ENV,
    services: {}
  };

  // Check database connectivity
  try {
    await sequelize.authenticate();
    health.services.database = {
      status: "healthy",
      message: "Database connection successful"
    };
  } catch (error) {
    health.services.database = {
      status: "unhealthy",
      message: "Database connection failed",
      error: error.message
    };
    health.success = false;
  }

  // Check memory usage
  const memUsage = process.memoryUsage();
  health.services.memory = {
    status: memUsage.heapUsed / memUsage.heapTotal > 0.9 ? "warning" : "healthy",
    used: Math.round(memUsage.heapUsed / 1024 / 1024) + " MB",
    total: Math.round(memUsage.heapTotal / 1024 / 1024) + " MB",
    percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100) + "%"
  };

  const statusCode = health.success ? 200 : 503;
  res.status(statusCode).json(health);
});

// Readiness probe for Kubernetes/Docker
router.get("/ready", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({ status: "ready" });
  } catch (error) {
    res.status(503).json({ status: "not ready", error: error.message });
  }
});

// Liveness probe for Kubernetes/Docker
router.get("/live", (req, res) => {
  res.status(200).json({ status: "alive" });
});

module.exports = router;
