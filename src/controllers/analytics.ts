import { Request, Response } from "express";
import { getAnalyticsSummary } from "../services/analytics";

export const analyticsSummary = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const summary = await getAnalyticsSummary();

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics summary.",
    });
  }
};