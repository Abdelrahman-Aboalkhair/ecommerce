import { Router } from "express";
import { connectDB } from "../infra/database/database.config";
import redisClient from "../infra/cache/redis";
import logger from "../infra/winston/logger";

const router = Router();

// Basic health check
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "1.0.0",
  });
});

// Detailed health check with dependencies
router.get("/health/detailed", async (req, res) => {
  const health = {
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "1.0.0",
    dependencies: {
      database: "unknown",
      redis: "unknown",
    },
    memory: {
      used: process.memoryUsage().heapUsed,
      total: process.memoryUsage().heapTotal,
      external: process.memoryUsage().external,
    },
    cpu: process.cpuUsage(),
  };

  try {
    // Check database connection
    await connectDB();
    health.dependencies.database = "connected";
  } catch (error) {
    health.dependencies.database = "disconnected";
    health.status = "DEGRADED";
    logger.error("Database health check failed:", error);
  }

  try {
    // Check Redis connection
    await redisClient.ping();
    health.dependencies.redis = "connected";
  } catch (error) {
    health.dependencies.redis = "disconnected";
    health.status = "DEGRADED";
    logger.error("Redis health check failed:", error);
  }

  const statusCode = health.status === "OK" ? 200 : 503;
  res.status(statusCode).json(health);
});

// Readiness probe for Kubernetes
router.get("/ready", async (req, res) => {
  try {
    // Check if all critical services are ready
    await connectDB();
    await redisClient.ping();

    res.status(200).json({
      status: "ready",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Readiness check failed:", error);
    res.status(503).json({
      status: "not ready",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Liveness probe for Kubernetes
router.get("/live", (req, res) => {
  res.status(200).json({
    status: "alive",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
