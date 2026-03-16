import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: z.ZodTypeAny, source: "body" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const response: any = {
        success: false,
        message: "Invalid request data",
      };

      if (process.env.NODE_ENV !== "production") {
        response.errors = result.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        }));
      }

      return res.status(400).json(response);
    }

    // replace request data with validated & sanitized data
    req[source] = result.data;
    next();
  };
