import express, { Request, Response, NextFunction } from "express";

import transactionRoutes from "./routes/transaction";
import analyticsRoutes from "./routes/analytics";

import logger from "./lib/logger";
import { successResponse, errorResponse } from "./lib/response";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";


const app = express();

app.use(express.json());

// Health Check
app.get("/status", (req: Request, res: Response) => {
  logger.info("Health check endpoint accessed.");

  return successResponse(
    res,
    200,
    "Server is running"
  );
});

// Routes
app.use("/v1", transactionRoutes);
app.use("/v1/analytics", analyticsRoutes);

// Global Error Handler
app.use(notFound);
app.use(errorHandler);
export default app;