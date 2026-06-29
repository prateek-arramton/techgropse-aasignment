import { Request, Response } from "express";
import logger from "../lib/logger";
import { errorResponse } from "../lib/response";


export const notFound = (req: Request, res: Response) => {
  logger.warn("Route not found.", {
    method: req.method,
    url: req.originalUrl,
  });

  return errorResponse(
    res,
    404,
    "Route not found."
  );
};