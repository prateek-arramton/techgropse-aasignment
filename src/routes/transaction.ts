import { Router } from "express";
import rateLimit from "express-rate-limit";
import { createTransaction } from "../controllers/transaction";

const router = Router();

const transactionRateLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later."
  }
});

router.post(
  "/transactions",
  transactionRateLimiter,
  createTransaction
);

export default router;