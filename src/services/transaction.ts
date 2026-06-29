import { Transaction } from "../constants/store";
import {
  users,
  transactions,
  processedTransactions,
} from "../constants/store";

import logger from "../lib/logger";
import { sleep } from "../lib/utils";

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
    logger.warn("Duplicate transaction received. Skipping processing.", {
      transactionId: id,
      userId,
    });

    return;
  }

  const user = users.get(userId);

  if (!user) {
    logger.error("User not found.", {
      transactionId: id,
      userId,
    });

    throw new Error("User not found.");
  }

  if (user.walletBalance < amount) {
    logger.error("Insufficient wallet balance.", {
      transactionId: id,
      userId,
      balance: user.walletBalance,
      requestedAmount: amount,
    });

    throw new Error("Insufficient wallet balance.");
  }

  try {
    // Debit wallet
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

    logger.info("Transaction processed successfully.", {
      transactionId: id,
      userId,
      amount,
      currency,
    });
  } catch (error) {
    // Rollback
    user.walletBalance += amount;
    users.set(userId, user);

    transactions.delete(id);

    logger.error("Transaction processing failed. Rolled back changes.", {
      transactionId: id,
      userId,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });

    throw error;
  }
};