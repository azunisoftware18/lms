import { z } from "zod";

export const employeeSchema = z.object({

  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required"),

  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),

  role: z.enum(["ADMIN", "EMPLOYEE", "PARTNER"]),

  contactNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15),

  atlMobileNumber: z
    .string()
    .min(10, "Alternate phone must be at least 10 digits"),

  userName: z
    .string()
    .trim()
    .min(1, "Username is required"),

  isActive: z.coerce.boolean(),

  dob: z.coerce.date({
    errorMap: () => ({ message: "Date of birth is required" })
  }),

  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    required_error: "Gender is required"
  }),

  maritalStatus: z.enum([
    "SINGLE",
    "MARRIED",
    "DIVORCED",
    "WIDOWED"
  ]),

  designation: z
    .string()
    .min(1, "Designation is required"),

  emergencyContact: z
    .string()
    .min(10, "Emergency contact must be at least 10 digits"),

  emergencyRelationship: z
    .string()
    .min(1, "Emergency relationship is required"),

  experience: z
    .union([
      z.string().min(1),
      z.coerce.number().nonnegative()
    ])
    .optional(),

  reportingManagerId: z.string().optional(),

  workLocation: z.enum([
    "OFFICE",
    "REMOTE",
    "HYBRID"
  ]).optional(),

  department: z
    .string()
    .min(1, "Department is required"),

  dateOfJoining: z.string().optional(),

  salary: z
    .coerce
    .number()
    .positive("Salary must be positive")
    .optional(),

  address: z
    .string()
    .min(1, "Address is required"),

  city: z
    .string()
    .min(1, "City is required"),

  state: z
    .string()
    .min(1, "State is required"),

  pinCode: z
    .string()
    .min(6, "Pin code must be 6 digits"),

  branchId: z
    .string()
    .min(1, "Branch assignment is required")

});