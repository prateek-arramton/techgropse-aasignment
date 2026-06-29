import redis from "../config/redis";
import { CACHE_KEYS } from "../constants/cache";
import { transactions } from "../constants/store";
import logger from "../lib/logger";
import { sleep } from "../lib/utils";


const CACHE_TTL = Number(process.env.CACHE_TTL) || 60;

export const getAnalyticsSummary = async () => {
  const cached = await redis.get(CACHE_KEYS.ANALYTICS_SUMMARY);

  if (cached) {
    logger.info("Analytics cache hit.");
    return JSON.parse(cached);
  }

  logger.info("Analytics cache miss.");

  const lock = await redis.set(
    CACHE_KEYS.ANALYTICS_SUMMARY_LOCK,
    "locked",
    "EX",
    5,
    "NX"
  );

  if (!lock) {
    logger.info("Waiting for analytics cache to be populated.");

    while (true) {
      await sleep(100);

      const cachedData = await redis.get(CACHE_KEYS.ANALYTICS_SUMMARY);

      if (cachedData) {
        logger.info("Analytics cache became available.");
        return JSON.parse(cachedData);
      }
    }
  }

  try {
    logger.info("Generating analytics summary...");

    // Simulate slow database query
    await sleep(2000);

    const { totalProcessedVolume, userVolumes } = Array.from(
      transactions.values()
    ).reduce(
      (acc, transaction) => {
        if (transaction.status !== "COMPLETED") {
          return acc;
        }

        acc.totalProcessedVolume += transaction.amount;

        acc.userVolumes.set(
          transaction.userId,
          (acc.userVolumes.get(transaction.userId) ?? 0) +
            transaction.amount
        );

        return acc;
      },
      {
        totalProcessedVolume: 0,
        userVolumes: new Map<string, number>(),
      }
    );

    const topUsers = [...userVolumes.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([userId, volume]) => ({
        userId,
        volume,
      }));

    const summary = {
      totalProcessedVolume,
      topUsers,
      generatedAt: new Date().toISOString(),
    };

    await redis.set(
      CACHE_KEYS.ANALYTICS_SUMMARY,
      JSON.stringify(summary),
      "EX",
      CACHE_TTL
    );

    logger.info("Analytics summary cached successfully.");

    return summary;
  } finally {
    await redis.del(CACHE_KEYS.ANALYTICS_SUMMARY_LOCK);
  }
};