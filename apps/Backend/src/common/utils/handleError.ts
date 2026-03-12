import { Response } from "express";
import logger from "../logger.js";
import { AppError } from "./apiError.js";

export const handleError = (
  res: Response,
  error: unknown,
  defaultStatus = 500,
  defaultMessage = "Something went wrong!"
) => {
  if (error instanceof AppError) {
    logger.error("AppError occurred: %o", error);
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }
  
  if (error instanceof Error) {
    logger.error("Error occurred: %o", error);
    return res.status(defaultStatus).json({
      success: false,
      message: error.message || defaultMessage,
    });
  }
  
  // Handle unexpected thrown values (string, number, etc.)
  logger.error("Unknown error occurred: %o", error);
  return res.status(defaultStatus).json({
    success: false,
    message: defaultMessage,
  });
};
