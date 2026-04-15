import { z } from "zod";
import { Role } from "../../../generated/prisma-client/enums.js";

const strongPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character",
  );

const employeeAddressSchema = z.object({
  addressLine1: z.string().trim().min(1),
  addressLine2: z.string().trim().optional(),
  city: z.string().trim().min(1),
  district: z.string().trim().optional(),
  state: z.string().trim().min(1),
  pinCode: z.string().trim().min(1).max(6),
  landmark: z.string().trim().optional(),
  phoneNumber: z.string().trim().optional(),
});

/* ================= CREATE ================= */

export const createEmployeeSchema = z
  .object({
    fullName: z.string().trim().min(1),
    email: z.string().trim().email(),
    password: strongPasswordSchema,
    role: z.nativeEnum(Role).optional(),
    contactNumber: z.string().trim().min(10).max(15),
    userName: z.string().trim().min(1),
    atlMobileNumber: z.string().trim().optional(),
    dob: z.coerce.date(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
    maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]),
    designation: z.string().min(1),
    roleTitle: z.string().trim().optional(),
    employeeRoleId: z.string().trim().min(1),
    gradeBand: z.string().trim().optional(),
    reportingManager: z.string().trim().min(1),
    branchCode: z.string().trim().min(1),
    regionZone: z.string().trim().optional(),
    dateOfJoining: z.coerce.date().optional(),
    experience: z
      .union([z.string().min(1), z.number().nonnegative()])
      .optional(),
    workLocation: z
      .string()
      .trim()
      .transform((s) => s.toUpperCase())
      .refine((v) => ["OFFICE", "REMOTE", "HYBRID"].includes(v), {
        message: 'Invalid option: expected one of "OFFICE"|"REMOTE"|"HYBRID"',
      })
      .optional(),
    city: z.string().trim().min(1),
    state: z.string().trim().min(1),
    pinCode: z
      .string()
      .trim()
      .regex(/^\d{6}$/),
    accountHolder: z.string().trim().min(1),
    bankName: z.string().trim().min(1),
    bankAccountNo: z.string().trim().min(1),
    ifsc: z.string().trim().min(1),
    upiId: z.string().trim().optional(),
    basicSalary: z.coerce.number().positive(),
    conveyance: z.coerce.number().min(0).optional(),
    medicalAllowance: z.coerce.number().min(0).optional(),
    otherAllowances: z.coerce.number().min(0).optional(),
    pfDeduction: z.coerce.number().min(0).optional(),
    taxDeduction: z.coerce.number().min(0).optional(),
    status: z.enum(["Active", "Inactive"]).optional(),
    isActive: z.coerce.boolean().optional(),
    salary: z.number().positive().optional(),
    branchId: z.string().min(1).optional(),
    roleDocuments: z
      .record(
        z.string(),
        z.record(
          z.string(),
          z.object({
            name: z.string().min(1),
            type: z.string().optional(),
            size: z.number().optional(),
          }),
        ),
      )
      .optional(),
    addresses: z
      .object({
        currentAddress: employeeAddressSchema.optional(),
        permanentAddress: employeeAddressSchema.optional(),
      })
      .optional(),
  })
  .strict();

/* ================= UPDATE ================= */

export const updateEmployeeSchema = z
  .object({
    fullName: z.string().trim().min(1).optional(),
    email: z.string().trim().email().optional(),
    password: strongPasswordSchema.optional(),
    role: z.nativeEnum(Role).optional(),
    contactNumber: z.string().trim().min(10).max(15).optional(),
    isActive: z.coerce.boolean().optional(),
    userName: z.string().trim().min(1).optional(),
    atlMobileNumber: z.string().trim().optional(),
    dob: z.coerce.date().optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
    maritalStatus: z
      .enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"])
      .optional(),
    designation: z.string().min(1).optional(),
    roleTitle: z.string().trim().optional(),
    employeeRoleId: z.string().min(1).optional(),
    
    reportingManager: z.string().trim().min(1).optional(),
    branchCode: z.string().trim().min(1).optional(),
    regionZone: z.string().trim().optional(),
    dateOfJoining: z.coerce.date().optional(),
    experience: z
      .union([z.string().min(1), z.number().nonnegative()])
      .optional(),
    workLocation: z
      .string()
      .trim()
      .transform((s) => s.toUpperCase())
      .refine((v) => ["OFFICE", "REMOTE", "HYBRID"].includes(v), {
        message: 'Invalid option: expected one of "OFFICE"|"REMOTE"|"HYBRID"',
      })
      .optional(),
    city: z.string().trim().min(1).optional(),
    state: z.string().trim().min(1).optional(),
    pinCode: z
      .string()
      .trim()
      .regex(/^\d{6}$/)
      .optional(),
    accountHolder: z.string().trim().min(1).optional(),
    bankName: z.string().trim().min(1).optional(),
    bankAccountNo: z.string().trim().min(1).optional(),
    ifsc: z.string().trim().min(1).optional(),
    upiId: z.string().trim().optional(),
    basicSalary: z.coerce.number().positive().optional(),
    conveyance: z.coerce.number().min(0).optional(),
    medicalAllowance: z.coerce.number().min(0).optional(),
    otherAllowances: z.coerce.number().min(0).optional(),
    pfDeduction: z.coerce.number().min(0).optional(),
    taxDeduction: z.coerce.number().min(0).optional(),
    status: z.enum(["Active", "Inactive"]).optional(),
    salary: z.number().positive().optional(),
    branchId: z.string().min(1).optional(),
    roleDocuments: z
      .record(
        z.string(),
        z.record(
          z.string(),
          z.object({
            name: z.string().min(1),
            type: z.string().optional(),
            size: z.number().optional(),
          }),
        ),
      )
      .optional(),
    addresses: z
      .object({
        currentAddress: employeeAddressSchema.optional(),
        permanentAddress: employeeAddressSchema.optional(),
      })
      .optional(),
  })
  .strict();

/* ================= PARAM ================= */

export const employeeIdParamSchema = z.object({
  id: z.string().min(1, "id param is required"),
});
