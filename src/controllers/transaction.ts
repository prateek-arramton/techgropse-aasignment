import { Request, Response } from "express";
import transactionQueue from "../config/queue";

export const createTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, userId, amount, currency, timestamp } = req.body;
    if (!id || !userId || !amount || !currency || !timestamp) {
      res.status(400).json({
        success: false,
        message: "All fields are required."
      });
      return;
    }

    if (typeof amount !== "number" || amount <= 0) {
      res.status(400).json({
        success: false,
        message: "Amount must be greater than 0."
      });
      return;
    }

    await transactionQueue.add(
      "process-transaction",
      {
        id,
        userId,
        amount,
        currency,
        timestamp
      }
    
    );
    res.status(202).json({
      success: true,
      message: "Transaction queued successfully."
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error."
    });
  }
};