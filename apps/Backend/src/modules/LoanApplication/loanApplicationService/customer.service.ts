import * as Enums from "../../../../generated/prisma-client/enums.js";
import { AppError } from "../../../common/utils/apiError.js";
import type { FullLoanApplicationInput } from "../loanApplication.types.js";

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
        nationality: data.applicant.nationality,
        category: data.applicant.category,
        contactNumber: data.applicant.contactNumber,
        email: data.applicant.email,
        relationshipWithCoApplicant: data.coApplicants?.length
          ? data.coApplicants[0].relation
          : Enums.CoApplicantRelation.OTHER,
        employmentType: data.applicant.employmentType,
      },
    });
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
