// src/common/middleware/validateRequest.ts
import { ZodTypeAny, ZodError, ZodIssue } from 'zod';

type Request = {
  body: unknown;
  query: unknown;
  params: unknown;
};

type Response = {
  status: (code: number) => Response;
  json: (body: unknown) => Response;
};

type NextFunction = () => void;

export const validateRequest = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      const err = error as unknown;
      if (err instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: err.issues.map((e: ZodIssue) => ({
            path: Array.isArray(e.path) ? e.path.join('.') : String(e.path),
            message: e.message
          }))
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
};