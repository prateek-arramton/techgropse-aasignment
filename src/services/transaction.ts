import { Transaction } from "../data/store";
import {
  users,
  transactions,
  processedTransactions,
} from "../data/store";

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

interface ProcessTransactionPayload {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  timestamp: string;
}

export const processTransaction = async (
  payload: ProcessTransactionPayload
): Promise<void> => {
  const { id, userId, amount, currency, timestamp } = payload;

  // Simulate network delay
  await sleep(500);

  // Idempotency check
  if (processedTransactions.has(id)) {
    console.log(`Transaction ${id} already processed.`);
    return;
  }

  const user = users.get(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.walletBalance < amount) {
    throw new Error("Insufficient wallet balance.");
  }

  // "Transaction" begins
  try {
    // Deduct wallet amount
    user.walletBalance -= amount;

    users.set(userId, user);

    const transaction: Transaction = {
      id,
      userId,
      amount,
      currency,
      timestamp,
      status: "COMPLETED",
    };

    transactions.set(id, transaction);

    processedTransactions.add(id);

    console.log(`Transaction ${id} processed successfully.`);
  } catch (error) {
    // Rollback (since we're using an in-memory store)
    user.walletBalance += amount;
    users.set(userId, user);

    transactions.delete(id);

    throw error;
  }
};