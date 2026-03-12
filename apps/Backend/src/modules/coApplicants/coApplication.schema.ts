import { z } from "zod";
import { CoApplicantRelation } from "../../../generated/prisma-client/enums.js";
import {
  employmentTypeEnum,
  accommodationTypeEnum,
  correspondenceAddressTypeEnum,
  addressSchema,
} from "../LoanApplication/loanApplication.schema.js";


export const createCoApplicantSchema = z.object({
  firstName: z.string().min(1),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  woname: z.string().optional(),
  relation: z.nativeEnum(CoApplicantRelation),
  relationOther: z.string().optional(),
  contactNumber: z.string().min(10),
  phoneNumber: z.string().min(10).optional(),
  email: z.string().email().optional(),

  dob: z.coerce.date().optional(),
  category: z.enum(["GENERAL", "SC", "ST", "NT", "OBC", "OTHER"]).optional(),
  maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED", "OTHER"]).optional(),
  noOfDependents: z.coerce.number().int().min(0).optional(),
  noOfChildren: z.coerce.number().int().min(0).optional(),
  qualification: z.string().optional(),
  correspondenceAddressType: correspondenceAddressTypeEnum.optional(),
  panNumber: z.string().optional(),
  aadhaarNumber: z.string().optional(),
  voterId: z.string().optional(),
  drivingLicenceNo: z.string().optional(),
  passportNumber: z.string().optional(),
  presentAccommodation: accommodationTypeEnum.optional(),
  periodOfStay: z.string().optional(),
  rentPerMonth: z.coerce.number().min(0).optional(),

  employmentType: employmentTypeEnum,
  addresses: z.array(addressSchema).optional(),
});
