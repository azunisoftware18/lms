import * as Enums from "../../../../generated/prisma-client/enums.js";
import type { FullLoanApplicationInput } from "../loanApplication.types.js";

export async function createKYC(tx: any, userId: string) {
  return tx.kyc.create({
    data: {
      userId,
      status: Enums.KycStatus.PENDING,
    },
  });
}

export async function attachKycToLoan(
  tx: any,
  loanId: string,
  kycId: string,
) {
  await tx.loanApplication.update({
    where: { id: loanId },
    data: { kycId },
  });
}

export async function createCoApplicants(
  tx: any,
  loanId: string,
  userId: string,
  coApplicants: FullLoanApplicationInput["coApplicants"],
) {
  if (!coApplicants?.length) return;

  for (const co of coApplicants) {
    const coApplication = await tx.coApplicant.create({
      data: {
        loanApplicationId: loanId,
        firstName: co.firstName,
        lastName: co.lastName ?? "",
        middleName: co.middleName,
        relation: co.relation as Enums.CoApplicantRelation,
        relationOther: co.relationOther,
        contactNumber: co.contactNumber,
        email: co.email,
        dob: co.dob,
        aadhaarNumber: co.aadhaarNumber,
        panNumber: co.panNumber,
        employmentType: co.employmentType as Enums.EmploymentType,
      },
    });

    const coKyc = await tx.kyc.create({
      data: {
        userId,
        status: Enums.KycStatus.PENDING,
      },
    });

    await tx.coApplicant.update({
      where: { id: coApplication.id },
      data: { kycId: coKyc.id },
    });
  }
}
