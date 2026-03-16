import type { Role } from "../../../generated/prisma-client/enums.js";

export type Gender = "MALE" | "FEMALE" | "OTHER";
export type MaritalStatus = "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED";
export type Relationship =
  | "FATHER"
  | "MOTHER"
  | "SPOUSE"
  | "SIBLING"
  | "FRIEND"
  | "OTHER";
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

export interface CreateEmployee {
  fullName: string;
  email: string;
  password: string;
  role?: Role;
  contactNumber: string;
  isActive?: boolean;

  // Required employee-specific fields
  userName: string;
  atlMobileNumber: string;
  dob: string | Date;

  // Optional employee-specific fields
  designation?: string;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  // Contact & address
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  addresses?: {
    currentAddress?: EmployeeAddressInput;
    permanentAddress?: EmployeeAddressInput;
  };

  // Emergency
  emergencyContact: string;
  emergencyRelationship?: Relationship;

  // Professional
  department?: string;
  dateOfJoining?: string | Date;
  experience?: string;
  workLocation?: WorkLocation;
  salary?: number;
  employeeRoleId: string;
  branchId: string;
}
