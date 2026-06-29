import dotenv from "dotenv";
dotenv.config();

import http from "http";

import app from "./app";
import redis from "./config/redis";
import transactionWorker from "./config/worker";

import logger from "./lib/logger";

const PORT = Number(process.env.PORT) || 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
  logger.info(`Server started successfully on port ${PORT}.`);
});

const gracefulShutdown = async (signal: string): Promise<void> => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  try {
    server.close(async () => {
      logger.info("HTTP server closed.");

      await transactionWorker.close();
      logger.info("BullMQ worker closed.");

      await redis.quit();
      logger.info("Redis connection closed.");

      logger.info("Application shutdown completed successfully.");

      process.exit(0);
    });
  } catch (error) {
    logger.error("Graceful shutdown failed.", {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });

    process.exit(1);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception.", {
    error: err.message,
    stack: err.stack,
  });

  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Promise Rejection.", {
    reason,
  });

  process.exit(1);
});