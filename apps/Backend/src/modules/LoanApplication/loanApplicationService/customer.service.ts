import * as Enums from "../../../../generated/prisma-client/enums.js";
import { AppError } from "../../../common/utils/apiError.js";
import type { FullLoanApplicationInput } from "../loanApplication.types.js";

export function toPrismaEmploymentType(
  value?: string | null,
): Enums.EmploymentType | undefined {
  if (!value) return undefined;
  const normalized = String(value).trim().toUpperCase();

  switch (normalized) {
    case "SALARIED":
      return Enums.EmploymentType.salaried;
    case "BUSINESS":
      return Enums.EmploymentType.business;
    case "PROFESSIONAL":
      return Enums.EmploymentType.professional;
    case "SELF_EMPLOYED":
      return Enums.EmploymentType.self_employed;
    case "OTHER":
      // Prisma enum does not have OTHER; use self_employed as closest bucket.
      return Enums.EmploymentType.self_employed;
    default:
      throw AppError.badRequest(`Invalid employmentType: ${value}`);
  }
}

export async function createCustomer(
  tx: any,
  data: FullLoanApplicationInput,
) {
  let customer = await tx.customer.findFirst({
    where: {
      OR: [
        data.applicant.panNumber
          ? { panNumber: data.applicant.panNumber }
          : undefined,
        data.applicant.aadhaarNumber
          ? { aadhaarNumber: data.applicant.aadhaarNumber }
          : undefined,
        data.applicant.contactNumber
          ? { contactNumber: data.applicant.contactNumber }
          : undefined,
      ].filter(Boolean) as object[],
    },
  });

  if (!customer) {
    customer = await tx.customer.create({
      data: {
        title: data.applicant.title,
        firstName: data.applicant.firstName,
        middleName: data.applicant.middleName,
        lastName: data.applicant.lastName,
        fatherName: data.applicant.fatherName,
        aadhaarProvider: data.applicant.aadhaarProvider || null,
        panProvider: data.applicant.panProvider || null,

        motherName: data.applicant.motherName,
        woname: data.applicant.woname,
        dob: data.applicant.dob,
        gender: data.applicant.gender,
        aadhaarNumber: data.applicant.aadhaarNumber,
        panNumber: data.applicant.panNumber,
        voterId: data.applicant.voterId,
        drivingLicenceNo: data.applicant.drivingLicenceNo,
        passportNumber: data.applicant.passportNumber,
        maritalStatus: data.applicant.maritalStatus,
        maritalStatusOther: data.applicant.maritalStatusOther,
        nationality: data.applicant.nationality,
        category: data.applicant.category,
        categoryOther: data.applicant.categoryOther,
        contactNumber: data.applicant.contactNumber,
        alternateNumber: data.applicant.alternateNumber,
        email: data.applicant.email,
        phoneNumber: data.applicant.phoneNumber,
        noOfFamilyDependents: data.applicant.noOfFamilyDependents,
        noOfChildren: data.applicant.noOfChildren,
        qualification: data.applicant.qualification,
        correspondenceAddressType: data.applicant.correspondenceAddressType,
        presentAccommodation: data.applicant.presentAccommodation,
        periodOfStay: data.applicant.periodOfStay,
        rentPerMonth: data.applicant.rentPerMonth,
        relationWithCoApplicantOther: data.applicant.relationWithCoApplicantOther,
        genderOther: data.applicant.genderOther,
        relationshipWithCoApplicant: data.coApplicants?.length
          ? data.coApplicants[0].relation
          : Enums.CoApplicantRelation.OTHER,
        employmentType: toPrismaEmploymentType(data.applicant.employmentType),
      },
    });
  }

  // If a matching customer was found and the payload includes aadhaarProvider,
  // persist/update it on the existing record so provider JSON is not lost.
  if (customer && data.applicant?.aadhaarProvider) {
    try {
      await tx.customer.update({
        where: { id: customer.id },
        data: { aadhaarProvider: data.applicant.aadhaarProvider },
      });
    } catch (e) {
      // non-fatal: log and continue
      console.error("Failed to update existing customer aadhaarProvider:", e);
    }
  }

  return customer;
}

export async function getUserBranchId(tx: any, userId: string) {
  const user = await tx.user.findUnique({
    where: { id: userId },
    select: { branchId: true },
  });

  if (!user?.branchId) {
    throw AppError.notFound("User branch information not found");
  }

  return user.branchId;
}

export async function validateLoanTypeId(tx: any, loanTypeId: string) {
  const loanType = await tx.loanType.findFirst({
    where: { id: loanTypeId, isActive: true },
    select: { id: true },
  });

  if (!loanType) {
    throw AppError.badRequest("Invalid loan type");
  }

  return loanType.id;
}
