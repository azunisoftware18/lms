import { prisma } from "../../db/prismaService.js";
import { CreateLoanApplication, FullLoanApplicationInput } from "./loanApplication.types.js";
import createLoanApplicationSchema, {
  ApproveLoanInput,
} from "./loanApplication.schema.js";
import * as Enums from "../../../generated/prisma-client/enums.js";
import { generateLoanNumber } from "../../common/generateId/generateLoanNumber.js";
import {
  getPagination,
  buildPaginationMeta,
} from "../../common/utils/pagination.js";
import { buildLoanApplicationSearch } from "../../common/utils/search.js";

import path from "path";
import fs from "fs";
import { getAccessibleBranchIds } from "../../common/utils/branchAccess.js";
import { buildBranchFilter } from "../../common/utils/branchFilter.js";
import { logAction } from "../../audit/audit.helper.js";
import { calculatePartnerCommission } from "../partner/partnerCommission.service.js";
import logger from "../../common/logger.js";


export async function uploadLoanDocumentsService(
  loanApplicationId: string,
  documents: {
    documentType: string;
    documentPath: string;
    uploadedBy: string;
  }[],
) {
  return prisma.$transaction(async (tx) => {
    /* 1️⃣ Validate loan & KYC */
    const loanApplication = await tx.loanApplication.findUnique({
      where: { id: loanApplicationId },
      select: {
        id: true,
        branchId: true,
        kyc: { select: { id: true } },
      },
    });

    if (!loanApplication) {
      throw new Error("Loan application not found");
    }

    if (!loanApplication.kyc) {
      throw new Error("KYC record not found for loan application");
    }

    /* 2️⃣ Handle each document - update if exists, create if not */
    for (const doc of documents) {
      const existingDoc = await tx.document.findFirst({
        where: {
          loanApplicationId,
          documentType: doc.documentType,
        },
      });

      if (existingDoc) {
        // Update existing document (re-upload scenario)
        await tx.document.update({
          where: { id: existingDoc.id },
          data: {
            documentPath: doc.documentPath,
            uploadedBy: doc.uploadedBy,
            verificationStatus: "pending",
            verified: false,
            verifiedBy: null,
            verifiedAt: null,
            rejectionReason: null,
          },
        });
      } else {
        // Create new document
        await tx.document.create({
          data: {
            loanApplicationId,
            kycId: loanApplication.kyc!.id,
            branchId: loanApplication.branchId,
            documentType: doc.documentType,
            documentPath: doc.documentPath,
            uploadedBy: doc.uploadedBy,
          },
        });
      }
    }

    await logAction({
      entityType: "LOAN",
      entityId: loanApplicationId,
      action: "UPDATE_LOAN_STATUS",
      performedBy: documents[0].uploadedBy,
      branchId: loanApplication.branchId,
      oldValue: null,
      newValue: { documents: { status: "uploaded" } },
    });

    /* 3️⃣ Return all documents */
    return tx.document.findMany({
      where: { loanApplicationId },
      orderBy: { createdAt: "asc" },
    });
  });
}

export async function verifyDocumentService(
  documentId: string,
  verifierId: string,
) {
  return prisma.$transaction(async (tx) => {
    // First, check if document exists
    const existingDocument = await tx.document.findUnique({
      where: { id: documentId },
    });

    if (!existingDocument) {
      const err: any = new Error("Document not found");
      err.statusCode = 404;
      throw err;
    }

    if (existingDocument.verificationStatus !== "pending") {
      const err: any = new Error(
        `Document is already ${existingDocument.verificationStatus}. Cannot verify a document that is not in pending status.`,
      );
      err.statusCode = 400;
      throw err;
    }

    const document = await tx.document.update({
      where: { id: documentId },
      data: {
        verified: true,
        verifiedBy: verifierId,
        verifiedAt: new Date(),
        verificationStatus: "verified",
      },
    });
    const unverifiedCount = await tx.document.count({
      where: {
        kycId: document.kycId,
        verificationStatus: "pending",
      },
    });

    if (unverifiedCount === 0) {
      if (!document.kycId) throw new Error("Document missing kycId");
      if (!document.loanApplicationId)
        throw new Error("Document missing loanApplicationId");

      await tx.kyc.update({
        where: { id: document.kycId },
        data: {
          status: Enums.KycStatus.VERIFIED,
          verifiedBy: verifierId,
          verifiedAt: new Date(),
        },
      });
      await tx.loanApplication.update({
        where: { id: document.loanApplicationId },
        data: {
          status: "under_review",
        },
      });
    }

    await logAction({
      entityType: "DOCUMENT",
      entityId: documentId,
      action: "VERIFY_DOCUMENT",
      performedBy: verifierId,
      branchId: document.branchId,
      oldValue: { verificationStatus: "pending" },
      newValue: { verificationStatus: "verified" },
    });

    return document;
  });
}

export async function rejectDocumentService(
  documentId: string,
  reason: string,
  verifierId: string,
) {
  const existing = await prisma.document.findUnique({
    where: { id: documentId },
  });
  if (!existing) {
    const err: any = new Error("Document not found");
    err.statusCode = 404;
    throw err;
  }
  if (!existing.loanApplicationId) {
    const err: any = new Error("Document not linked to any loan application");
    err.statusCode = 400;
    throw err;
  }
  const loanApplication = await prisma.loanApplication.findUnique({
    where: { id: existing.loanApplicationId },
  });

  if (!loanApplication) {
    const err: any = new Error("Associated loan application not found");
    err.statusCode = 404;
    throw err;
  }
  if (loanApplication.status !== "kyc_pending") {
    const err: any = new Error("Loan application not in KYC pending status");
    err.statusCode = 400;
    throw err;
  }

  const document = await prisma.document.update({
    where: { id: documentId },
    data: {
      verified: false,
      verifiedBy: verifierId,
      verifiedAt: new Date(),
      verificationStatus: "rejected",
      rejectionReason: reason,
    },
  });

  if (!document.kycId) throw new Error("Document missing kycId");
  if (!document.loanApplicationId)
    throw new Error("Document missing loanApplicationId");
  await prisma.kyc.update({
    where: { id: document.kycId },
    data: {
      status: Enums.KycStatus.REJECTED,
      verifiedBy: verifierId,
      verifiedAt: new Date(),
    },
  });
  await prisma.loanApplication.update({
    where: { id: document.loanApplicationId },
    data: {
      status: "kyc_pending",
    },
  });

  await logAction({
    entityType: "DOCUMENT",
    entityId: documentId,
    action: "REJECT_DOCUMENT",
    performedBy: verifierId,
    branchId: document.branchId,
    oldValue: { verificationStatus: "pending" },
    newValue: { verificationStatus: "rejected", rejectionReason: reason },
  });

  return document;
}


export async function  getAlldoumentsforLoanApplicationService(loanApplicationId: string) {
  try {
    const documents = await prisma.document.findMany({
      where: { loanApplicationId },
      orderBy: { createdAt: "asc" },
    });
    return documents;
  } catch (error) {
    throw error;
  }
}

export const reuploadLoanDocumentService = async (
  loanApplicationId: string,
  documentType: string,
  file: {
    filename: string;
    path: string;
    uploadedBy: string;
  },
) => {
  return prisma.$transaction(async (tx) => {
    /* 1️⃣ Find existing document */
    const existingDoc = await tx.document.findFirst({
      where: {
        loanApplicationId,
        documentType,
      },
    });

    if (!existingDoc) {
      const err: any = new Error(
        `Document ${documentType} not found. Upload first.`,
      );
      err.statusCode = 404;
      throw err;
    }
    /* 2️⃣ Delete old file from disk */
    if (existingDoc.documentPath) {
      // Handle path format: /public/uploads/filename or /uploads/filename
      let filePath = existingDoc.documentPath;
      // Remove leading slash if present
      if (filePath.startsWith('/')) {
        filePath = filePath.slice(1);
      }
      const oldFilePath = path.join(process.cwd(), filePath);

      try {
        fs.unlinkSync(oldFilePath);
      } catch (err: any) {
        if (err.code !== "ENOENT") {
          // Log unexpected errors but don't fail the transaction
          console.error(`Failed to delete old file: ${oldFilePath}`, err);
        }
      }
    }
    /* 3️⃣ Update document */
    const updatedDocument = await tx.document.update({
      where: { id: existingDoc.id },
      data: {
        documentPath: file.path,
        uploadedBy: file.uploadedBy,
        verificationStatus: "pending",
        rejectionReason: null,
        verified: false,
        verifiedBy: null,
        verifiedAt: null,
      },
    });

    /* 4️⃣ Log audit trail */
    await logAction({
      entityType: "DOCUMENT",
      entityId: existingDoc.id,
      action: "REUPLOAD_DOCUMENT",
      performedBy: file.uploadedBy,
      branchId: existingDoc.branchId,
      oldValue: {
        documentPath: existingDoc.documentPath,
        verificationStatus: existingDoc.verificationStatus,
        verified: existingDoc.verified,
      },
      newValue: {
        documentPath: updatedDocument.documentPath,
        verificationStatus: "pending",
        verified: false,
      },
      remarks: `Document ${documentType} reuploaded for loan application`,
    });

    return updatedDocument;
  });
};

export const getAllLoanApplicationsService = async (params: {
  page?: number;
  limit?: number;
  q?: string;
  user: { id: string; role: Enums.Role };
}) => {
  const { page, limit, skip } = getPagination(params.page, params.limit);

  let userBranchId: string | undefined;
  if (params.user.role === "EMPLOYEE") {
    const employee = await prisma.employee.findUnique({
      where: { userId: params.user.id },
      select: { branchId: true },
    });
    if (!employee) {
      throw new Error("Employee record not found for user");
    }
    userBranchId = employee.branchId;
  }
  const accessibleBranches = await getAccessibleBranchIds({
    id: params.user.id,
    role: params.user.role,
    branchId: userBranchId,
  });
  const searchFilter = buildLoanApplicationSearch(params.q);

  const where: any = {
    ...searchFilter,
    ...buildBranchFilter(accessibleBranches),
    //...(accessibleBranches ? { branchId: { in: accessibleBranches } } : {}),
  };

  const employee = await prisma.employee.findUnique({
    where: { userId: params.user.id },
    select: { id: true },
  });

  if (params.user.role === "EMPLOYEE") {
    where.loanAssignments = {
      some: {
        employeeId: employee?.id,
        isActive: true,
      },
    };
  }

  const [data, total] = await Promise.all([
    prisma.loanApplication.findMany({
      where,
      include: {
        customer: true,
        kyc: { include: { documents: true } },
        coapplicants: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.loanApplication.count({ where }),
  ]);

  return {
    data,
    meta: buildPaginationMeta(total, page, limit),
  };
};

export const getLoanApplicationByIdService = async (
  id: string,
  user?: { id: string; role: Enums.Role },
) => {
  // Implementation for retrieving a loan application by ID with branch isolation
  try {
    const loanApplication = await prisma.loanApplication.findUnique({
      where: { id },
      include: {
        customer: true,
        loanType: true,
        emis: true,
        kyc: {
          include: {
            documents: true,
          },
        },
        loanRecoveries: {
          include: {
            recoveryPayments: true,
          },
        },
        coapplicants: {
          include: {
            documents: true,
          },
        },
      },
    });

    if (!loanApplication) {
      const err: any = new Error("Loan application not found");
      err.statusCode = 404;
      throw err;
    }

    // Apply branch isolation if user is provided
    if (user) {
      let userBranchId: string | undefined;
      if (user.role === "EMPLOYEE") {
        const employee = await prisma.employee.findUnique({
          where: { userId: user.id },
          select: { branchId: true },
        });
        if (!employee) {
          const err: any = new Error("Employee record not found");
          err.statusCode = 404;
          throw err;
        }
        userBranchId = employee.branchId;
      }

      const accessibleBranches = await getAccessibleBranchIds({
        id: user.id,
        role: user.role,
        branchId: userBranchId,
      });

      // Check if user has access to this loan's branch
      // null means no filter (global access), so only check if accessibleBranches is an array
      if (
        accessibleBranches !== null &&
        !accessibleBranches.includes(loanApplication.branchId)
      ) {
        const err: any = new Error("Unauthorized: No access to this loan");
        err.statusCode = 403;
        throw err;
      }
    }

    return loanApplication;
  } catch (error) {
    throw error;
  }
};

type StatusUpdate = {
  status: Enums.LoanStatus;
};
export const updateLoanApplicationStatusService = async (
  id: string,
  statusData: StatusUpdate,
  userId: string,
) => {
  // Implementation for updating loan application status
  try {
    // Fetch existing loan application before update
    const existingLoan = await prisma.loanApplication.findUnique({
      where: { id },
      select: { status: true, branchId: true },
    });

    if (!existingLoan) {
      const err: any = new Error("Loan application not found");
      err.statusCode = 404;
      throw err;
    }

    const updatedLoanApplication = await prisma.loanApplication.update({
      where: { id },
      data: { status: statusData.status },
      include: {
        customer: true,
        kyc: {
          include: {
            documents: true,
          },
        },
        documents: true,
      },
    });

    // Log status change
    await logAction({
      entityType: "LOAN",
      entityId: id,
      action: "UPDATE_LOAN_STATUS",
      performedBy: userId,
      branchId: existingLoan.branchId,
      oldValue: { status: existingLoan.status },
      newValue: { status: statusData.status },
      remarks: `Loan status updated from ${existingLoan.status} to ${statusData.status}`,
    });

    return updatedLoanApplication;
  } catch (error) {
    throw error;
  }
};

export const reviewLoanService = async (loanId: string) => {
  const loan = await prisma.loanApplication.findUnique({
    where: { id: loanId },
    include: {
      customer: true,
      lead: true,
      kyc: {
        include: {
          documents: true,
        },
      },
    },
  });
  if (!loan) throw new Error("Loan not found");

  if (loan.status !== "application_in_progress") {
    throw new Error("Loan not eligible for review");
  }

  return prisma.loanApplication.update({
    where: { id: loanId },
    data: { status: "under_review" },
  });
};

export const approveLoanService = async (
  loanId: string,
  userId: string,
  data: ApproveLoanInput,
) => {
  // Fetch existing loan data before approval
  const existingLoan = await prisma.loanApplication.findUnique({
    where: { id: loanId },
    select: {
      status: true,
      branchId: true,
      approvedAmount: true,
      tenureMonths: true,
      interestType: true,
      interestRate: true,
      emiAmount: true,
      latePaymentFeeType: true,
      latePaymentFee: true,
      bounceCharges: true,
    },
  });

  if (!existingLoan) {
    const err: any = new Error("Loan application not found");
    err.statusCode = 404;
    throw err;
  }

  if (existingLoan.status !== "under_review") {
    const err: any = new Error("Loan not ready for approval");
    err.statusCode = 400;
    throw err;
  }

  // normalize emiStartDate to a full ISO Date if provided as yyyy-mm-dd string
  let emiStartDateNormalized: Date | undefined = undefined;
  if (data.emiStartDate !== undefined && data.emiStartDate !== null) {
    if (typeof data.emiStartDate === "string") {
      if (/^\d{4}-\d{2}-\d{2}$/.test(data.emiStartDate)) {
        emiStartDateNormalized = new Date(data.emiStartDate + "T00:00:00.000Z");
      } else {
        const parsed = new Date(data.emiStartDate);
        if (isNaN(parsed.getTime())) throw new Error("Invalid emiStartDate");
        emiStartDateNormalized = parsed;
      }
    } else {
      emiStartDateNormalized = new Date(data.emiStartDate as any);
    }
  }

  const result = await prisma.loanApplication.updateMany({
    where: {
      id: loanId,
      status: "under_review",
    },
    data: {
      status: "approved",
      latePaymentFeeType: data.latePaymentFeeType,
      latePaymentFee: data.latePaymentFee,
      bounceCharges: data.bounceCharges,

      approvedAmount: data.approvedAmount,
      tenureMonths: data.tenureMonths,

      interestType: data.interestType,
      interestRate: data.interestRate,

      foreclosureAllowed: data.foreclosureAllowed ?? true,
      foreclosureChargesType: data.foreclosureChargesType,
      foreclosureCharges: data.foreclosureCharges,

      prepaymentAllowed: data.prepaymentAllowed ?? true,
      prepaymentChargeType: data.prepaymentChargeType,
      prepaymentCharges: data.prepaymentCharges,

      emiStartDate: emiStartDateNormalized,
      emiPaymentAmount: data.emiPaymentAmount,
      emiAmount: data.emiAmount,

      approvalDate: new Date(),
      approvedBy: userId,
      approvedAt: new Date(),
    },
  });

  if (result.count === 0) {
    throw new Error("Loan not ready for approval");
  }

  const loandata = await prisma.loanApplication.findUnique({
    where: { id: loanId },
  });

  if (!loandata) {
    throw new Error("Loan application not found after approval");
  }

  await logAction({
    entityType: "LOAN",
    entityId: loanId,
    action: "APPROVE_LOAN",
    performedBy: userId,
    branchId: existingLoan.branchId,
    oldValue: {
      status: existingLoan.status,
      approvedAmount: existingLoan.approvedAmount,
      tenureMonths: existingLoan.tenureMonths,
      interestType: existingLoan.interestType,
      interestRate: existingLoan.interestRate,
    },
    newValue: {
      status: "approved",
      approvedAmount: data.approvedAmount,
      tenureMonths: data.tenureMonths,
      interestType: data.interestType,
      interestRate: data.interestRate,
      latePaymentFeeType: data.latePaymentFeeType,
      latePaymentFee: data.latePaymentFee,
      bounceCharges: data.bounceCharges,
      emiAmount: data.emiAmount,
      emiStartDate: emiStartDateNormalized,
    },
    remarks: `Loan approved with amount ${data.approvedAmount} for ${data.tenureMonths} months`,
  });
  try {
    await calculatePartnerCommission(loanId);
  } catch (error) {
    logger.error(
      `Failed to calculate partner commission for loan ${loanId} after approval:`,
      error,
    );
  }

  return loandata;
};

export const rejectLoanService = async (
  loanId: string,
  reason: string,
  userId: string,
) => {
  const loan = await prisma.loanApplication.findUnique({
    where: { id: loanId },
    select: {
      id: true,
      status: true,
      branchId: true,
      loanNumber: true,
      requestedAmount: true,
      rejectionReason: true,
    },
  });

  if (!loan) {
    const err: any = new Error("Loan application not found");
    err.statusCode = 404;
    throw err;
  }

  if (loan.status !== "under_review") {
    const err: any = new Error(
      "Loan not ready for rejection. Only loans under review can be rejected.",
    );
    err.statusCode = 400;
    throw err;
  }

  const updatedLoan = await prisma.loanApplication.update({
    where: { id: loanId },
    data: {
      status: "rejected",
      rejectionReason: reason,
      approvedBy: userId,
    },
  });

  await logAction({
    entityType: "LOAN",
    entityId: loanId,
    action: "REJECT_LOAN",
    performedBy: userId,
    branchId: loan.branchId,
    oldValue: {
      status: loan.status,
      rejectionReason: loan.rejectionReason,
    },
    newValue: {
      status: "rejected",
      rejectionReason: reason,
    },
    remarks: `Loan ${loan.loanNumber} rejected. Reason: ${reason}`,
  });

  return updatedLoan;
};



export const createFullLoanApplicationService = async (
  data: FullLoanApplicationInput,
  userId: string
) => {

  return prisma.$transaction(async(tx)=>{

    if (!data.loanTypeId) {
      throw new Error("loanTypeId is required")
    }

    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { branchId: true },
    })

    if (!user?.branchId) {
      throw new Error("User branch information not found")
    }

    const loanType = await tx.loanType.findFirst({
      where: { id: data.loanTypeId, isActive: true },
      select: { id: true },
    })

    if (!loanType) {
      throw new Error("Invalid loan type")
    }

    const loanNumber = await generateLoanNumber(tx)

    /* 1️⃣ Create Customer */

    const customer = await tx.customer.create({
      data:{
        title:data.applicant.title,
        firstName:data.applicant.firstName,
        middleName:data.applicant.middleName,
        lastName:data.applicant.lastName,
        fatherName:data.applicant.fatherName,
        motherName:data.applicant.motherName,
        woname:data.applicant.woname,
        dob:data.applicant.dob,
        gender:data.applicant.gender,
        aadhaarNumber:data.applicant.aadhaarNumber,
        panNumber:data.applicant.panNumber,
        voterId:data.applicant.voterId,
        drivingLicenceNo:data.applicant.drivingLicenceNo,
        passportNumber:data.applicant.passportNumber,
        maritalStatus:data.applicant.maritalStatus,
        nationality:data.applicant.nationality,
        category:data.applicant.category,
        contactNumber:data.applicant.contactNumber,
        email:data.applicant.email,
        relationshipWithCoApplicant:
          data.coApplicants?.length
            ? data.coApplicants[0].relation
            : Enums.CoApplicantRelation.OTHER,
        employmentType:data.applicant.employmentType
      }
    })

    /* 2️⃣ Create Address */

    await tx.address.create({
      data:{
        ...data.addresses.currentAddress,
        addressType:"CURRENT_RESIDENTIAL",
        customerId:customer.id
      }
    })

    if(data.addresses.permanentAddress){

      await tx.address.create({
        data:{
          ...data.addresses.permanentAddress,
          addressType:"PERMANENT",
          customerId:customer.id
        }
      })

    }

    /* 3️⃣ Create Loan */

    const loan = await tx.loanApplication.create({

      data:{
        loanNumber,
        requestedAmount:data.loanRequirement.loanAmount,
        tenureMonths:data.loanRequirement.tenure,
        interestType:data.loanRequirement.interestType ?? Enums.InterestType.FLAT,
        loanPurpose:data.loanRequirement.loanPurpose,
        customer:{ connect: { id: customer.id } },
        loanType:{ connect: { id: loanType.id } },
        branch:{ connect: { id: user.branchId } },
        createdBy:{ connect: { id: userId } },
        status:"application_in_progress",
      }

    })

    /* 4️⃣ Existing Loans */

    if(data.existingLoans?.length){

      await tx.existingLoan.createMany({
        data:data.existingLoans.map(
          (l:any)=>({
          ...l,
          loanApplicationId:loan.id
        }))
      })

    }

    /* 5️⃣ Credit Cards */

    if(data.creditCards?.length){

      await tx.creditCard.createMany({
        data:data.creditCards.map((c:any)=>({
          holderName: c.holderName,
          cardNumber: c.cardNumber,
          issuingBank: c.issuingBank,
          holderSince: c.holderSince ? new Date(c.holderSince) : null,
          creditLimit: c.creditLimit,
          outstandingAmount: c.outstandingAmount,
          loanApplicationId:loan.id
        }))
      })

    }

    /* 6️⃣ Bank Accounts */

    if(data.bankAccounts?.length){

      await tx.bankAccount.createMany({
        data:data.bankAccounts.map((b:any)=>({
          holderName: b.holderName,
          bankName: b.bankName,
          branchName: b.branchName,
          accountType: b.accountType,
          accountNumber: b.accountNumber,
          openingDate: b.openingDate ? new Date(b.openingDate) : null,
          balanceAmount: b.balanceAmount,
          loanApplicationId:loan.id
        }))
      })

    }

    /* 7️⃣ Insurance */

    if(data.insurancePolicies?.length){

      await tx.insurancePolicy.createMany({
        data:data.insurancePolicies.map((p:any)=>({
          issuedBy: p.issuedBy,
          branchName: p.branchName,
          holderName: p.holderName,
          policyNumber: p.policyNumber,
          maturityDate: p.maturityDate ? new Date(p.maturityDate) : null,
          policyValue: p.policyValue,
          policyType: p.policyType,
          yearlyPremium: p.yearlyPremium,
          paidUpValue: p.paidUpValue,
          loanApplicationId:loan.id
        }))
      })

    }

    /* 8️⃣ Property */

    if(data.properties?.length){

      await tx.property.createMany({
        data:data.properties.map((p:any)=>({
          propertySelected: p.propertySelected,
          landArea: p.landArea,
          buildUpArea: p.buildUpArea,
          ownershipType: p.ownershipType,
          landType: p.landType,
          purchaseFrom: p.purchaseFrom,
          purchaseOther: p.purchaseOther,
          constructionStage: p.constructionStage,
          constructionPercent: p.constructionPercent,
          loanApplicationId:loan.id
        }))
      })

    }

    /* 9️⃣ References */

    if(data.references?.length){

      await tx.reference.createMany({
        data:data.references.map((r:any)=>({
          name: r.name,
          fatherName: r.fatherName,
          address: r.address,
          city: r.city,
          state: r.state,
          pinCode: r.pinCode,
          phone: r.phone,
          occupation: r.occupation,
          loanApplicationId:loan.id
        }))
      })

    }

    /* 10️⃣ Loan Requirement */

    await tx.loanRequirement.create({

      data:{
        loanApplicationId:loan.id,
        loanAmount:data.loanRequirement.loanAmount,
        tenure:data.loanRequirement.tenure,
        interestOption:data.loanRequirement.interestOption,
        loanPurpose:data.loanRequirement.loanPurpose,
        repaymentMethod:data.loanRequirement.repaymentMethod,
      }

    })

    /* 11️⃣ Questionnaire */

    if(data.questionnaire){

      await tx.loanQuestionnaire.create({

        data:{
          loanApplicationId:loan.id,
          ...data.questionnaire
        }

      })

    }

    return loan

  })

}