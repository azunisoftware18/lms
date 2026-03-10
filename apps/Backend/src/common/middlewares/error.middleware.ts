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
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
  
  if (err instanceof Error) {
    logger.error("Error: %o", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
  
  logger.error("Unknown error: %o", err);
  return res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
};

export default errorMiddleware;
