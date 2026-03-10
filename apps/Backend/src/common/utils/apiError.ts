import { Response } from "express";
import logger from "../logger.js";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string): AppError {
    return new AppError(message, 400);
  }

  static unauthorized(message: string): AppError {
    return new AppError(message, 401);
  }

  static forbidden(message: string): AppError {
    return new AppError(message, 403);
  }

  static notFound(message: string): AppError {
    return new AppError(message, 404);
  }

  static conflict(message: string): AppError {
    return new AppError(message, 409);
  }

  static internal(message: string): AppError {
    return new AppError(message, 500);
  }
}

export class ApiError extends Error {
  static send(
    res: Response,
    statusCode: number,
    message = "Something went wrong!",
    errors: any[] = []
  ) {
    const stack =
      process.env.NODE_ENV === "development" ? new Error().stack : undefined;

    logger.error("API error %d: %s", statusCode, message, { errors, stack });

    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      stack,
    });
  }
}
