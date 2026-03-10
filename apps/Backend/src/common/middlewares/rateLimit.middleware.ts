import { Request, Response, NextFunction } from "express";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

type RateLimitOptions = {
  windowMs?: number;
  max?: number;
  message?: string;
  keyScope?: "ip" | "user" | "both";
};

export const createRateLimiter = (options: RateLimitOptions = {}) => {
  const {
    windowMs = 60_000,
    max = 30,
    message = "Too many requests. Please try again later.",
    keyScope = "user",
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    let key: string;

    if (keyScope === "ip") {
      key = `${req.ip}:${req.baseUrl}${req.path}`;
    } else if (keyScope === "user") {
      key = `${req.user?.id ?? req.ip}:${req.baseUrl}${req.path}`;
    } else {
      key = `${req.user?.id ?? "anon"}:${req.ip}:${req.baseUrl}${req.path}`;
    }

    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || now > bucket.resetAt) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (bucket.count >= max) {
      return res.status(429).json({
        success: false,
        message,
      });
    }

    bucket.count += 1;
    return next();
  };
};

// Simple helper for backward compatibility
export const rateLimit = (max = 30, windowMs = 60_000) => {
  return createRateLimiter({ max, windowMs });
};
