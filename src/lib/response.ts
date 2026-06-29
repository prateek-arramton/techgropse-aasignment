import { Response } from "express";

export const successResponse = (
  res: Response,
  status: number,
  message: string,
  data?: unknown
): Response => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (
  res: Response,
  status: number,
  message: string
): Response => {
  return res.status(status).json({
    success: false,
    message,
  });
};