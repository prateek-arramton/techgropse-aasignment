import { NextFunction, Request, Response } from "express";
import logger from "../lib/logger";
import { errorResponse } from "../lib/response";


export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error("Unhandled application error.", {
    method: req.method,
    url: req.originalUrl,
    error: err.message,
    stack: err.stack,
  });

  return errorResponse(
    res,
    500,
    "Internal Server Error."
  );
};