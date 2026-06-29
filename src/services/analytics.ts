import redis from "../config/redis";
import { transactions } from "../data/store";

const CACHE_KEY = "analytics:summary";
const LOCK_KEY = "analytics:summary:lock";
const CACHE_TTL = Number(process.env.CACHE_TTL) || 60;

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getAnalyticsSummary = async () => {
  // 1. Check Cache
  const cached = await redis.get(CACHE_KEY);

  if (cached) {
    console.log("Cache Hit");
    return JSON.parse(cached);
  }

  console.log("Cache Miss");

  // 2. Acquire Lock (Cache Stampede Protection)
  const lock = await redis.set(LOCK_KEY, "locked", "EX", 5, "NX");

  if (!lock) {
    // Someone else is generating the cache
    while (true) {
      await sleep(100);

      const cachedData = await redis.get(CACHE_KEY);

      if (cachedData) {
        console.log("Waited for cache.");
        return JSON.parse(cachedData);
      }
    }
  }

  try {
    // Simulate slow database query
    await sleep(2000);

    let totalVolume = 0;

    const userVolumes = new Map<string, number>();

    for (const transaction of transactions.values()) {
      if (transaction.status !== "COMPLETED") continue;

      totalVolume += transaction.amount;

      userVolumes.set(
        transaction.userId,
        (userVolumes.get(transaction.userId) || 0) + transaction.amount
      );
    }

    const topUsers = [...userVolumes.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([userId, volume]) => ({
        userId,
        volume,
      }));

    const summary = {
      totalProcessedVolume: totalVolume,
      topUsers,
      generatedAt: new Date().toISOString(),
    };

    await redis.set(
      CACHE_KEY,
      JSON.stringify(summary),
      "EX",
      CACHE_TTL
    );

    return summary;
  } finally {
    await redis.del(LOCK_KEY);
  }
};