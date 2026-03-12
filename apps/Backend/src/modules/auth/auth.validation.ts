import { body } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const loginValidation = [
  body("email").optional().isEmail().withMessage("Valid email is required"),
  body("userName").optional().isString().withMessage("Valid userName is required"),
  body("password").notEmpty().withMessage("Password is required"),
  body().custom((value) => {
    if (!value?.email && !value?.userName) {
      throw new Error("Either email or userName is required");
    }
    return true;
  }),
];

export const validateAuthRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: errors.array(),
    });
  }
  return next();
};
