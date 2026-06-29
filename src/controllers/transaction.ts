import { Request, Response } from "express";

import transactionQueue from "../config/queue";
import { JOBS } from "../constants/queue";
import logger from "../lib/logger";
import { errorResponse, successResponse } from "../lib/response";

export const createTransaction = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id, userId, amount, currency, timestamp } = req.body;

    if (!id || !userId || !amount || !currency || !timestamp) {
      logger.warn("Transaction request validation failed.", {
        reason: "Missing required fields",
        body: req.body,
      });

      return errorResponse(
        res,
        400,
        "All fields are required."
      );
    }

    if (typeof amount !== "number" || amount <= 0) {
      logger.warn("Transaction request validation failed.", {
        reason: "Invalid amount",
        amount,
      });

      return errorResponse(
        res,
        400,
        "Amount must be greater than 0."
      );
    }

    await transactionQueue.add(JOBS.PROCESS_TRANSACTION, {
      id,
      userId,
      amount,
      currency,
      timestamp,
    });

    logger.info("Transaction queued successfully.", {
      transactionId: id,
      userId,
      amount,
      currency,
    });

    return successResponse(
      res,
      202,
      "Transaction queued successfully."
    );
  } catch (error) {
    logger.error("Failed to queue transaction.", {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });

    return errorResponse(
      res,
      500,
      "Internal Server Error."
    );
  }
};