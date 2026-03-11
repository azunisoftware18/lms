import * as Enums from "../../../../generated/prisma-client/enums.js";
import type { FullLoanApplicationInput } from "../loanApplication.types.js";
import {
  createOccupationalDetailsForEntity,
  createEmploymentDetailsForEntity,
} from "./loan.service.js";

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
  customerId: string,
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
        fatherName: co.fatherName,
        motherName: co.motherName,
        woname: co.woname,
        relation: co.relation as Enums.CoApplicantRelation,
        relationOther: co.relationOther,
        contactNumber: co.contactNumber,
        phoneNumber: co.phoneNumber,
        email: co.email,
        dob: co.dob,
        category: co.category,
        maritalStatus: co.maritalStatus,
        noOfDependents: co.noOfDependents,
        noOfChildren: co.noOfChildren,
        qualification: co.qualification,
        correspondenceAddressType: co.correspondenceAddressType,
        aadhaarNumber: co.aadhaarNumber,
        panNumber: co.panNumber,
        voterId: co.voterId,
        drivingLicenceNo: co.drivingLicenceNo,
        passportNumber: co.passportNumber,
        presentAccommodation: co.presentAccommodation,
        periodOfStay: co.periodOfStay,
        rentPerMonth: co.rentPerMonth,
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

    if (co.addresses?.length) {
      await tx.address.createMany({
        data: co.addresses.map((address) => ({
          ...address,
          coApplicantId: coApplication.id,
        })),
      });
    }

    await createOccupationalDetailsForEntity(
      tx,
      { customerId, coApplicantId: coApplication.id },
      co.occupationalDetails,
    );
    await createEmploymentDetailsForEntity(
      tx,
      { customerId, coApplicantId: coApplication.id },
      co.employmentDetails,
    );

    if (co.financialDetails) {
      await tx.coApplicantFinancialDetails.create({
        data: {
          coApplicantId: coApplication.id,
          ...co.financialDetails,
        },
      });
    }
  }
}
