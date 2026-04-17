import { z } from "zod";

export const employeeSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),

  email: z.string().trim().email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),

  role: z.enum(["ADMIN", "EMPLOYEE", "PARTNER"]).optional(),

  contactNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15),

  atlMobileNumber: z
    .string()
    .refine((value) => !value || value.length >= 10, {
      message: "Alternate phone must be at least 10 digits",
    })
    .optional(),

  userName: z.string().trim().min(1, "Username is required"),

  isActive: z.coerce.boolean().optional(),

  dob: z.coerce.date({
    errorMap: () => ({ message: "Date of birth is required" }),
  }),

  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    required_error: "Gender is required",
  }),

  maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]),

  designation: z.string().min(1, "Designation is required"),

  roleTitle: z.string().trim().optional(),

  employeeRoleId: z.string().trim().min(1, "Role is required"),

  gradeBand: z.string().trim().optional(),

  reportingManager: z.string().trim().optional(),

  branchCode: z.string().trim().min(1, "Branch code is required"),

  regionZone: z.string().trim().optional(),

  experience: z
    .union([z.string().min(1), z.coerce.number().nonnegative()])
    .optional(),

  workLocation: z.enum(["OFFICE", "REMOTE", "HYBRID"]).optional(),

  dateOfJoining: z.string().optional(),

  city: z.string().min(1, "City is required"),

  state: z.string().min(1, "State is required"),

  pinCode: z.string().regex(/^\d{6}$/, "Pin code must be 6 digits"),

  accountHolder: z.string().trim().min(1, "Account holder name is required"),

  bankName: z.string().trim().min(1, "Bank name is required"),

  bankAccountNo: z.string().trim().min(1, "Bank account number is required"),

  ifsc: z.string().trim().min(1, "IFSC code is required"),

  upiId: z.string().trim().optional(),

  basicSalary: z.coerce.number().positive("Basic salary must be positive"),

  conveyance: z.coerce.number().min(0).optional(),
  medicalAllowance: z.coerce.number().min(0).optional(),
  otherAllowances: z.coerce.number().min(0).optional(),
  pfDeduction: z.coerce.number().min(0).optional(),
  taxDeduction: z.coerce.number().min(0).optional(),

  status: z.enum(["Active", "Inactive"]).optional(),

  branchId: z.string().optional(),
});
