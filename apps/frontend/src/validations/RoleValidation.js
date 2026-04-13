import * as z from "zod";

// Frontend validation matching backend employeeRole schema
export const roleSchema = z.object({
  roleTitle: z.string().trim().min(1, "Role title is required"),
  roleName: z
    .string()
    .trim()
    .min(1, "Role machine name is required")
    .regex(
      /^[A-Z_]+$/,
      "Role name must be uppercase letters and underscores only",
    ),
  documentsRequired: z
    .array(z.string())
    .min(1, "Select at least one required document"),
  documentsOptions: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

// For login form (if needed separately)
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const roleUpdateSchema = roleSchema.partial();

export const moduleIcons = {
  dashboard: "BarChart2",
  customers: "Users",
  loans: "CreditCard",
  payments: "FileText",
  reports: "BarChart2",
  settings: "Settings",
  adminManagement: "Lock",
  users: "Users",
  leads: "Users",
  "loan-applications": "FileText",
  "loan-accounts": "CreditCard",
  nach: "FileText",
  branch: "Building2",
};
