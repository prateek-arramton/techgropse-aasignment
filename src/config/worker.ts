import { Job, Worker } from "bullmq";
import { processTransaction } from "../services/transaction";
import { QUEUES } from "../constants/queue";
import logger from "../lib/logger";

interface TransactionJob {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  timestamp: string;
}

const transactionWorker = new Worker<TransactionJob>(
  QUEUES.TRANSACTION,
  async (job) => {
    await processTransaction(job.data);
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    },
    concurrency: 5,
  }
);

transactionWorker.on("ready", () => {
  logger.info("Transaction worker is ready.");
});

transactionWorker.on("completed", (job: Job<TransactionJob>) => {
  logger.info("Transaction processed successfully.", {
    jobId: job.id,
    transactionId: job.data.id,
    userId: job.data.userId,
  });
});

transactionWorker.on("failed", (job, err) => {
  logger.error("Transaction processing failed.", {
    jobId: job?.id,
    transactionId: job?.data.id,
    userId: job?.data.userId,
    attempts: job?.attemptsMade,
    error: err.message,
    stack: err.stack,
  });
});

transactionWorker.on("error", (err) => {
  logger.error("Worker encountered an error.", {
    error: err.message,
    stack: err.stack,
  });
});

export default transactionWorker;