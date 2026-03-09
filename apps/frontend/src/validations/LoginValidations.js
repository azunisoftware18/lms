// validations/LoginValidations.js
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .min(1, "Email cannot be empty")
    .email("Please enter a valid email address"),
  
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(1, "Password cannot be empty")
    .min(6, "Password must be at least 6 characters long")
    .max(50, "Password cannot exceed 50 characters")
});