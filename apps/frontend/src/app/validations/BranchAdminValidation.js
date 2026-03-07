import { z } from "zod";

export const branchAdminSchema = (isEditMode = false) =>
  z.object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .min(3, "Name must be at least 3 characters"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email format"),

    userName: z
      .string()
      .min(1, "Username is required")
      .min(4, "Username must be at least 4 characters"),

    contactNumber: z
      .string()
      .min(1, "Contact number is required")
      .regex(/^[0-9]{10}$/, "Enter valid 10-digit number"),

    branchId: z
      .string()
      .min(1, "Please select a branch"),

    password: isEditMode
      ? z
          .string()
          .optional()
          .refine(
            (val) => !val || val.length >= 6,
            "Password must be at least 6 characters"
          )
      : z
          .string()
          .min(1, "Password is required")
          .min(6, "Password must be at least 6 characters"),
  });