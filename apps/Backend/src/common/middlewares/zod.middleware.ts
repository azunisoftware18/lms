import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: z.ZodTypeAny, source: "body" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
      });
    }

    // replace request data with validated & sanitized data
    req[source] = result.data;
    next();
  };
