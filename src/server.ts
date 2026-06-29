import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app";
import redis from "./config/redis";

import transactionWorker from "./config/worker";

const PORT = Number(process.env.PORT) || 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Shutting down...`);

  try {
    server.close(async () => {
      console.log("server closed.");

      await transactionWorker.close();
      console.log("Worker closed.");

      // Close Redis connection
      await redis.quit();
      console.log("Redis disconnected.");

      console.log("shutdown complete.");

      process.exit(0);
    });
  } catch (error) {
    console.error("Shutdown failed:", error);
    process.exit(1);
  }
};





process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));


process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});