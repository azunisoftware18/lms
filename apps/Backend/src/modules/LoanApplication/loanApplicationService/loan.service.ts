import * as Enums from "../../../../generated/prisma-client/enums.js";
import { AppError } from "../../../common/utils/apiError.js";
import type { FullLoanApplicationInput } from "../loanApplication.types.js";

export async function ensureNoActiveLoan(tx: any, customerId: string) {
  const existingLoan = await tx.loanApplication.findFirst({
    where: {
      customerId,
      status: {
        in: [
          "application_in_progress",
          "kyc_pending",
          "under_review",
          "approved",
          "active",
        ],
      },
    },
  });

  if (existingLoan) {
    throw AppError.conflict("Customer already has an active loan application");
  }
}

export async function createLoan(
  tx: any,
  payload: {
    loanNumber: string;
    data: FullLoanApplicationInput;
    customerId: string;
    loanTypeId: string;
    branchId: string;
    userId: string;
  },
) {
  return tx.loanApplication.create({
    data: {
      loanNumber: payload.loanNumber,
      requestedAmount: payload.data.loanRequirement.loanAmount,
      tenureMonths: payload.data.loanRequirement.tenure,
      interestType:
        payload.data.loanRequirement.interestType ?? Enums.InterestType.FLAT,
      loanPurpose: payload.data.loanRequirement.loanPurpose,
      customer: { connect: { id: payload.customerId } },
      loanType: { connect: { id: payload.loanTypeId } },
      branch: { connect: { id: payload.branchId } },
      createdBy: { connect: { id: payload.userId } },
      status: "application_in_progress",
    },
  });
}

export async function createFinancialDetails(
  tx: any,
  data: FullLoanApplicationInput,
  loanId: string,
) {
  if (data.existingLoans?.length) {
    await tx.existingLoan.createMany({
      data: data.existingLoans.map((l: any) => ({
        ...l,
        loanApplicationId: loanId,
      })),
    });
  }

  if (data.creditCards?.length) {
    await tx.creditCard.createMany({
      data: data.creditCards.map((c) => ({
        holderName: c.holderName,
        cardNumber: c.lastFourDigits,
        issuingBank: c.issuingBank,
        holderSince: c.holderSince ? new Date(c.holderSince) : null,
        creditLimit: c.creditLimit,
        outstandingAmount: c.outstandingAmount,
        loanApplicationId: loanId,
      })),
    });
  }

  if (data.bankAccounts?.length) {
    await tx.bankAccount.createMany({
      data: data.bankAccounts.map((b: any) => ({
        holderName: b.holderName,
        bankName: b.bankName,
        branchName: b.branchName,
        accountType: b.accountType,
        accountNumber: b.accountNumber,
        openingDate: b.openingDate ? new Date(b.openingDate) : null,
        balanceAmount: b.balanceAmount,
        loanApplicationId: loanId,
      })),
    });
  }

  if (data.insurancePolicies?.length) {
    await tx.insurancePolicy.createMany({
      data: data.insurancePolicies.map((p: any) => ({
        issuedBy: p.issuedBy,
        branchName: p.branchName,
        holderName: p.holderName,
        policyNumber: p.policyNumber,
        maturityDate: p.maturityDate ? new Date(p.maturityDate) : null,
        policyValue: p.policyValue,
        policyType: p.policyType,
        yearlyPremium: p.yearlyPremium,
        paidUpValue: p.paidUpValue,
        loanApplicationId: loanId,
      })),
    });
  }

  if (data.properties?.length) {
    await tx.property.createMany({
      data: data.properties.map((p: any) => ({
        propertySelected: p.propertySelected,
        landArea: p.landArea,
        buildUpArea: p.buildUpArea,
        ownershipType: p.ownershipType,
        landType: p.landType,
        purchaseFrom: p.purchaseFrom,
        purchaseOther: p.purchaseOther,
        constructionStage: p.constructionStage,
        constructionPercent: p.constructionPercent,
        loanApplicationId: loanId,
      })),
    });
  }

  if (data.references?.length) {
    await tx.reference.createMany({
      data: data.references.map((r: any) => ({
        name: r.name,
        fatherName: r.fatherName,
        address: r.address,
        city: r.city,
        state: r.state,
        pinCode: r.pinCode,
        phone: r.phone,
        occupation: r.occupation,
        loanApplicationId: loanId,
      })),
    });
  }

  await tx.loanRequirement.create({
    data: {
      loanApplicationId: loanId,
      loanAmount: data.loanRequirement.loanAmount,
      tenure: data.loanRequirement.tenure,
      interestOption: data.loanRequirement.interestOption,
      loanPurpose: data.loanRequirement.loanPurpose,
      repaymentMethod: data.loanRequirement.repaymentMethod,
    },
  });

  if (data.questionnaire) {
    await tx.loanQuestionnaire.create({
      data: {
        loanApplicationId: loanId,
        ...data.questionnaire,
      },
    });
  }
}
