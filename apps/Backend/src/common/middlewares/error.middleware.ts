import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/apiError.js";
import logger from "../logger.js";

// Express error-handling middleware
const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.error("AppError: %o", err);
    const genericMessageByStatus: Record<number, string> = {
      400: "Invalid request",
      401: "Unauthorized",
      403: "Forbidden",
      404: "Resource not found",
      409: "Request could not be completed",
    };

    const safeConflictMessages = new Set([
      "Employee already exists",
      "Employee with this email already exists",
      "Employee with this username already exists",
    ]);
    const message =
      err.statusCode === 409 && safeConflictMessages.has(err.message)
        ? err.message
        : genericMessageByStatus[err.statusCode] || "Internal Server Error";

    return res.status(err.statusCode).json({
      success: false,
      message,
    });
  }
  
  if (err instanceof Error) {
    logger.error("Error: %o", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
  
  logger.error("Unknown error: %o", err);
  return res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
};

export default errorMiddleware;
