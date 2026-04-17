import type { Role } from "../../../generated/prisma-client/enums.js";

export type Gender = "MALE" | "FEMALE" | "OTHER";
export type MaritalStatus = "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED";
export type WorkLocation = "OFFICE" | "REMOTE" | "HYBRID";

export interface EmployeeAddressInput {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district?: string;
  state: string;
  pinCode: string;
  landmark?: string;
  phoneNumber?: string;
}

export interface EmployeeRoleDocumentMeta {
  name: string;
  type?: string;
  size?: number;
}

export interface CreateEmployee {
  fullName: string;
  email: string;
  password: string;
  role?: Role;
  contactNumber: string;
  userName: string;
  atlMobileNumber?: string;
  dob: string | Date;
  gender: Gender;
  maritalStatus: MaritalStatus;
  designation: string;
  roleTitle?: string;
  employeeRoleId: string;
  gradeBand?: string;
  reportingManager: string;
  branchCode: string;
  regionZone?: string;
  dateOfJoining?: string | Date;
  experience?: string | number;
  workLocation?: WorkLocation;
  city: string;
  state: string;
  pinCode: string;

  accountHolder: string;
  bankName: string;
  bankAccountNo: string;
  ifsc: string;
  upiId?: string;

  basicSalary: number;
  conveyance?: number;
  medicalAllowance?: number;
  otherAllowances?: number;
  pfDeduction?: number;
  taxDeduction?: number;
  status?: "Active" | "Inactive";
  isActive?: boolean;

  // Optional compatibility fields
  salary?: number;
  branchId?: string;
  addresses?: {
    currentAddress?: EmployeeAddressInput;
    permanentAddress?: EmployeeAddressInput;
  };
  roleDocuments?: Record<string, Record<string, EmployeeRoleDocumentMeta>>;
}
