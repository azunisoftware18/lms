import { z } from "zod";
import { Role } from "../../../generated/prisma-client/enums.js";

const strongPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

const emergencyRelationshipSchema = z
  .string()
  .trim()
  .transform((s) => s.toUpperCase())
  .refine(
    (v) =>
      [
        "FATHER",
        "MOTHER",
        "SPOUSE",
        "SIBLING",
        "FRIEND",
        "OTHER",
        "BROTHER",
        "SISTER",
      ].includes(v),
    {
      message:
        'Invalid emergencyRelationship: expected one of "FATHER"|"MOTHER"|"SPOUSE"|"SIBLING"|"FRIEND"|"OTHER" (aliases: "BROTHER" and "SISTER" map to "SIBLING")',
    },
  )
  .transform((v) => (v === "BROTHER" || v === "SISTER" ? "SIBLING" : v));

const employeeAddressSchema = z.object({
  addressLine1: z.string().trim().min(1),
  addressLine2: z.string().trim().optional(),
  city: z.string().trim().min(1),
  district: z.string().trim().optional(),
  state: z.string().trim().min(1),
  pinCode: z.string().trim().min(1),
  landmark: z.string().trim().optional(),
  phoneNumber: z.string().trim().optional(),
});

/* ================= CREATE ================= */

export const createEmployeeSchema = z
  .object({
    // allow top-level user fields commonly sent with employee creation
    fullName: z.string().trim().min(1),
    email: z.string().trim().email(),
    password: strongPasswordSchema,
    role: z.nativeEnum(Role).optional(),
    contactNumber: z.string().trim().min(10).max(15),
    isActive: z.coerce.boolean(),
    userName: z.string().trim().min(1),
    atlMobileNumber: z.string().min(10),
    dob: z.coerce.date(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
    maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]),
    designation: z.string().min(1),
    emergencyContact: z.string().min(10),
    emergencyRelationship: emergencyRelationshipSchema,
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
    department: z.string().min(1),
    dateOfJoining: z.string().optional(),
    salary: z.number().positive().optional(),
    employeeRoleId: z.string().min(1, "Employee role is required"),
    address: z.string().min(1).optional(),
    city: z.string().min(1).optional(),
    state: z.string().min(1).optional(),
    pinCode: z.string().min(6).optional(),
    addresses: z
      .object({
        currentAddress: employeeAddressSchema.optional(),
        permanentAddress: employeeAddressSchema.optional(),
      })
      .optional(),
    branchId: z.string().min(1, "Branch assignment is required"),
  })
  .superRefine((data, ctx) => {
    const hasLegacyAddress = !!(
      data.address &&
      data.city &&
      data.state &&
      data.pinCode
    );
    const hasNestedAddress = !!(
      data.addresses?.currentAddress || data.addresses?.permanentAddress
    );

    if (!hasLegacyAddress && !hasNestedAddress) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["addresses"],
        message:
          "Provide address fields using either legacy address/city/state/pinCode or addresses.currentAddress/permanentAddress",
      });
    }
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
    mobileNumber: z.string().min(10).optional(),
    atlMobileNumber: z.string().min(10).optional(),
    dob: z.coerce.date().optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
    maritalStatus: z
      .enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"])
      .optional(),
    designation: z.string().min(1).optional(),
    emergencyContact: z.string().min(10).optional(),
    emergencyRelationship: emergencyRelationshipSchema.optional(),
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
    department: z.string().min(1).optional(),
    dateOfJoining: z.string().optional(),
    salary: z.number().positive().optional(),
    employeeRoleId: z.string().min(1).optional(),
    address: z.string().min(1).optional(),
    city: z.string().min(1).optional(),
    state: z.string().min(1).optional(),
    pinCode: z.string().min(6).optional(),
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
