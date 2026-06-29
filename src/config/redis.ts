import Redis from "ioredis";
import dotenv from "dotenv";
import logger from "../lib/logger";

dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  maxRetriesPerRequest: null,
});

redis.on("connect", () => {
  logger.info("Redis connected successfully.");
});

redis.on("error", (err: Error) => {
  logger.error("Redis connection error.", {
    error: err.message,
    stack: err.stack,
  });
});

export default redis;