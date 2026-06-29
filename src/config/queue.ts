import { Queue } from "bullmq";
import { QUEUES } from "../constants/queue";

const transactionQueue = new Queue(QUEUES.TRANSACTION, {
  connection: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: 100,
    removeOnFail: 100,
  },
});

export default transactionQueue;