import { z } from "zod";

export const leadSchema = z.object({

  fullName: z
    .string()
    .min(1, "Name is required")
    .min(3, "Name must be at least 3 characters"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),

  contactNumber: z
    .string()
    .min(1, "Mobile number is required")
    .regex(/^[0-9]{10}$/, "Enter valid 10-digit number"),

  dob: z
    .string()
    .min(1, "Date of birth is required"),

  gender: z
    .string()
    .min(1, "Gender is required"),

  state: z
    .string()
    .min(1, "State is required"),

  city: z
    .string()
    .min(1, "City is required"),

  pinCode: z
    .string()
    .min(1, "Pincode is required")
    .regex(/^[0-9]{6}$/, "Enter valid 6-digit pincode"),

  address: z
    .string()
    .min(1, "Address is required")
    .min(10, "Address must be at least 10 characters"),

  loanTypeId: z
    .string()
    .min(1, "Loan type is required"),

  loanAmount: z
    .coerce
    .number()
    .min(1000, "Minimum amount is ₹1000")
    .max(10000000, "Amount is too large")

});