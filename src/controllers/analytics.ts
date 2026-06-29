import { Request, Response } from "express";
import { getAnalyticsSummary } from "../services/analytics";
import logger from "../lib/logger";
import { successResponse, errorResponse } from "../lib/response";

export const analyticsSummary = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const summary = await getAnalyticsSummary();

    logger.info("Analytics summary fetched successfully.");

    successResponse(
      res,
      200,
      "Analytics summary fetched successfully.",
      summary
    );
  } catch (error) {
    logger.error("Failed to fetch analytics summary.", {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });

    errorResponse(
      res,
      500,
      "Failed to fetch analytics summary."
    );
  }
};