import { z } from "zod";

export const NachMandateSchema = z.object({

  bank: z
    .string()
    .trim()
    .min(3, "Bank name must be at least 3 characters"),

  account: z
    .string()
    .trim()
    .regex(/^\d{9,18}$/, "Account number must be 9–18 digits"),

  ifsc: z
    .string()
    .trim()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Enter valid IFSC (e.g. HDFC0001234)"),

  limit: z.coerce
    .number({
      invalid_type_error: "Debit limit must be a number",
    })
    .positive("Limit must be greater than 0")
    .max(1000000, "Limit cannot exceed ₹10,00,000"),

  startDate: z
    .string()
    .min(1, "Start date is required")
    .refine((date) => {
      const selected = new Date(date);
      const today = new Date();
      today.setHours(0,0,0,0);
      return selected >= today;
    }, "Start date cannot be in the past"),

});
