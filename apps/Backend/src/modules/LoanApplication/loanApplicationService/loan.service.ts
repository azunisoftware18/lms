import * as Enums from "../../../../generated/prisma-client/enums.js";
import { AppError } from "../../../common/utils/apiError.js";
import type {
  FullLoanApplicationInput,
  OccupationalInput,
  EmploymentInput,
  GuarantorInput,
} from "../loanApplication.types.js";
import { toPrismaEmploymentType } from "./customer.service.js";

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
      data: data.properties.map((p: any) => {
        const allowedPurchaseSources = new Set([
          Enums.PurchaseSource.BUILDER,
          Enums.PurchaseSource.SOCIETY,
          Enums.PurchaseSource.DEVELOPMENT_AUTHORITY,
          Enums.PurchaseSource.RESALE,
          Enums.PurchaseSource.SELF_CONSTRUCTION,
          Enums.PurchaseSource.OTHER,
        ]);
        const incoming = p.purchaseFrom;
        const normalizedPurchaseFrom = allowedPurchaseSources.has(incoming)
          ? incoming
          : Enums.PurchaseSource.OTHER;
        const purchaseOther = allowedPurchaseSources.has(incoming)
          ? p.purchaseOther
          : (p.purchaseOther ?? incoming);

        return {
          propertySelected: p.propertySelected,
          landArea: p.landArea,
          buildUpArea: p.buildUpArea,
          ownershipType: p.ownershipType,
          landType: p.landType,
          purchaseFrom: normalizedPurchaseFrom,
          purchaseOther,
          constructionStage: p.constructionStage,
          constructionPercent: p.constructionPercent,
          loanApplicationId: loanId,
        };
      }),
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

type EntityIds = {
  customerId: string;
  coApplicantId?: string;
  guarantorId?: string;
};

function hasMeaningfulValue(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (value instanceof Date) return !Number.isNaN(value.getTime());
  if (Array.isArray(value)) return value.some(hasMeaningfulValue);
  if (typeof value === "object")
    return Object.values(value).some(hasMeaningfulValue);
  return true;
}

export async function createOccupationalDetailsForEntity(
  tx: any,
  entity: EntityIds,
  input: OccupationalInput | OccupationalInput[] | undefined,
) {
  if (!input) return;
  const occupationalInputs = Array.isArray(input) ? input : [input];

  for (const occupationalInput of occupationalInputs) {
    if (!occupationalInput || !hasMeaningfulValue(occupationalInput)) continue;

    const { address, ...rest } = occupationalInput;
    let addressId: string | undefined;
    if (address && hasMeaningfulValue(address)) {
      const addr = await tx.address.create({
        data: { ...address, addressType: Enums.AddressType.OFFICE },
      });
      addressId = addr.id;
    }

    await tx.occupationalDetails.create({
      data: { ...entity, ...rest, addressId },
    });
  }
}

export async function createEmploymentDetailsForEntity(
  tx: any,
  entity: EntityIds,
  input: EmploymentInput | EmploymentInput[] | undefined,
) {
  if (!input) return;
  const employmentInputs = Array.isArray(input) ? input : [input];

  for (const employmentInput of employmentInputs) {
    if (!employmentInput?.employerType || !hasMeaningfulValue(employmentInput))
      continue;

    await tx.employmentDetails.create({
      data: { ...entity, ...employmentInput },
    });
  }
}

export async function createGuarantors(
  tx: any,
  loanId: string,
  customerId: string,
  guarantors: GuarantorInput[] | undefined,
) {
  if (!guarantors?.length) return;
  for (const g of guarantors) {
    const guarantor = await tx.guarantor.create({
      data: {
        loanApplicationId: loanId,
        firstName: g.firstName,
        middleName: g.middleName,
        lastName: g.lastName,
        aadhaarProvider: g.aadhaarProvider || null,
        panProvider: g.panProvider || null,
        fatherName: g.fatherName,
        motherName: g.motherName,
        woname: g.woname,
        dob: g.dob,
        contactNumber: g.contactNumber,
        phoneNumber: g.phoneNumber,
        email: g.email,
        panNumber: g.panNumber,
        aadhaarNumber: g.aadhaarNumber,
        voterId: g.voterId,
        drivingLicence: g.drivingLicence,
        passportNumber: g.passportNumber,
        category: g.category,
        maritalStatus: g.maritalStatus,
        noOfDependents: g.noOfDependents,
        noOfChildren: g.noOfChildren,
        qualification: g.qualification,
        correspondenceAddressType: g.correspondenceAddressType,
        relationshipWithApplicant: g.relationshipWithApplicant,
        relationshipOther: g.relationshipOther,
        accommodationType: g.accommodationType,
        periodOfStay: g.periodOfStay,
        rentPerMonth: g.rentPerMonth,
        employmentType: toPrismaEmploymentType(g.employmentType),
      },
    });

    if (g.addresses?.length) {
      await tx.address.createMany({
        data: g.addresses.map((address) => ({
          ...address,
          guarantorId: guarantor.id,
        })),
      });
    }

    await createOccupationalDetailsForEntity(
      tx,
      { customerId, guarantorId: guarantor.id },
      g.occupationalDetails,
    );
    await createEmploymentDetailsForEntity(
      tx,
      { customerId, guarantorId: guarantor.id },
      g.employmentDetails,
    );

    if (g.financialDetails) {
      await tx.guarantorFinancialDetails.create({
        data: { guarantorId: guarantor.id, ...g.financialDetails },
      });
    }
  }
}
