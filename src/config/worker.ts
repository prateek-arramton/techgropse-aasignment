import { Worker, Job } from "bullmq";
import { processTransaction } from "../services/transaction";

interface TransactionJob {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  timestamp: string;
}

const transactionWorker = new Worker(
  "transaction-queue",
  async (job: Job<TransactionJob>) => {
    await processTransaction(job.data);
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    },
  }
);

transactionWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

transactionWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed: ${err.message}`);
});

export default transactionWorker;