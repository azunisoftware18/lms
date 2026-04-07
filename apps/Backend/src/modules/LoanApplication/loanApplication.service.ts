import { prisma } from "../../db/prismaService.js";
import { FullLoanApplicationInput } from "./loanApplication.types.js";
import { ApproveLoanInput } from "./loanApplication.schema.js";
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
import { AppError } from "../../common/utils/apiError.js";
import {
  createCustomer,
  getUserBranchId,
  validateLoanTypeId,
} from "./loanApplicationService/customer.service.js";
import { createAddress } from "./loanApplicationService/address.service.js";
import {
  ensureNoActiveLoan,
  createLoan,
  createFinancialDetails,
  createOccupationalDetailsForEntity,
  createEmploymentDetailsForEntity,
  createGuarantors,
} from "./loanApplicationService/loan.service.js";
import {
  createKYC,
  attachKycToLoan,
  createCoApplicants,
} from "./loanApplicationService/kyc.service.js";

import {
  sanitizeDocumentList,
  sanitizeDocumentResponse,
} from "./loanApplicationService/document.service.js";
import { parseLoanDocumentCsv } from "../../common/constants/loanDocumentTypes.js";

export async function uploadLoanDocumentsService(
  loanApplicationId: string,
  documents: {
    documentType: string;
    documentPath: string;
    uploadedBy: string;
  }[],
) {
  return prisma.$transaction(async (tx) => {
    const loanApplication = await tx.loanApplication.findUnique({
      where: { id: loanApplicationId },
      select: {
        id: true,
        branchId: true,
        kyc: { select: { id: true } },
      },
    });

    if (!loanApplication) {
      throw AppError.notFound("Loan application not found");
    }

    if (!loanApplication.kyc) {
      throw AppError.notFound("KYC record not found for loan application");
    }

    for (const doc of documents) {
      const existingDoc = await tx.document.findFirst({
        where: {
          loanApplicationId,
          documentType: doc.documentType,
        },
      });

      if (existingDoc) {
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
        await tx.document.create({
          data: {
            loanApplicationId,
            kycId: loanApplication.kyc.id,
            branchId: loanApplication.branchId,
            documentType: doc.documentType,
            documentPath: doc.documentPath,
            uploadedBy: doc.uploadedBy,
          },
        });
      }
    }

    const uploadedDocumentTypes = Array.from(
      new Set(documents.map((doc) => doc.documentType)),
    );

    await logAction({
      entityType: "DOCUMENT",
      entityId: loanApplicationId,
      action: "UPLOAD_DOCUMENT",
      performedBy: documents[0].uploadedBy,
      branchId: loanApplication.branchId,
      oldValue: null,
      newValue: { uploadedDocumentTypes },
    });

    const uploadedDocuments = await tx.document.findMany({
      where: {
        loanApplicationId,
        documentType: { in: uploadedDocumentTypes },
      },
      orderBy: { createdAt: "asc" },
    });

    return sanitizeDocumentList(uploadedDocuments);
  });
}

export async function verifyDocumentService(
  documentId: string,
  verifierId: string,
) {
  return prisma.$transaction(async (tx) => {
    const existingDocument = await tx.document.findUnique({
      where: { id: documentId },
    });

    if (!existingDocument) {
      throw AppError.notFound("Document not found");
    }

    if (existingDocument.verificationStatus !== "pending") {
      throw AppError.badRequest(
        `Document is already ${existingDocument.verificationStatus}. Cannot verify a document that is not in pending status.`,
      );
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
      if (!document.kycId) throw AppError.badRequest("Document missing kycId");
      if (!document.loanApplicationId) {
        throw AppError.badRequest("Document missing loanApplicationId");
      }

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

    return sanitizeDocumentResponse(document);
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
    throw AppError.notFound("Document not found");
  }

  if (!existing.loanApplicationId) {
    throw AppError.badRequest("Document not linked to any loan application");
  }

  const loanApplication = await prisma.loanApplication.findUnique({
    where: { id: existing.loanApplicationId },
  });

  if (!loanApplication) {
    throw AppError.notFound("Associated loan application not found");
  }

  if (loanApplication.status !== "kyc_pending") {
    throw AppError.badRequest("Loan application not in KYC pending status");
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

  if (!document.kycId) throw AppError.badRequest("Document missing kycId");
  if (!document.loanApplicationId) {
    throw AppError.badRequest("Document missing loanApplicationId");
  }

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

  return sanitizeDocumentResponse(document);
}

export async function getAllDocumentsForLoanApplicationService(
  loanApplicationId: string,
) {
  const loanApplication = await prisma.loanApplication.findUnique({
    where: { id: loanApplicationId },
    select: {
      id: true,
      customer: {
        select: {
          firstName: true,
          lastName: true,
          dob: true,
          contactNumber: true,
          email: true,
          gender: true,
          maritalStatus: true,
          nationality: true,
          category: true,
          alternateNumber: true,
        },
      },
      coapplicants: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      guarantors: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  if (!loanApplication) {
    throw AppError.notFound("Loan application not found");
  }

  const coApplicantIds = loanApplication.coapplicants.map((c) => c.id);
  const guarantorIds = loanApplication.guarantors.map((g) => g.id);

  const documents = await prisma.document.findMany({
    where: {
      OR: [
        { loanApplicationId },
        ...(coApplicantIds.length > 0
          ? [{ coApplicantId: { in: coApplicantIds } }]
          : []),
        ...(guarantorIds.length > 0
          ? [{ guarantorId: { in: guarantorIds } }]
          : []),
      ],
    },
    select: {
      id: true,
      documentType: true,
      documentPath: true,
      verificationStatus: true,
      verified: true,
      verifiedAt: true,
      createdAt: true,
      updatedAt: true,
      rejectionReason: true,
      loanApplicationId: true,
      coApplicantId: true,
      guarantorId: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const coApplicantMap = new Map(
    loanApplication.coapplicants.map((c) => [c.id, c]),
  );
  const guarantorMap = new Map(
    loanApplication.guarantors.map((g) => [g.id, g]),
  );

  return documents.map((doc) => {
    if (doc.coApplicantId) {
      const coApplicant = coApplicantMap.get(doc.coApplicantId);
      return {
        ...sanitizeDocumentResponse(doc),
        documentPath: doc.documentPath,
        ownerType: "CO_APPLICANT",
        ownerId: doc.coApplicantId,
        ownerName: coApplicant
          ? `${coApplicant.firstName} ${coApplicant.lastName ?? ""}`.trim()
          : null,
      };
    }

    if (doc.guarantorId) {
      const guarantor = guarantorMap.get(doc.guarantorId);
      return {
        ...sanitizeDocumentResponse(doc),
        documentPath: doc.documentPath,
        ownerType: "GUARANTOR",
        ownerId: doc.guarantorId,
        ownerName: guarantor
          ? `${guarantor.firstName} ${guarantor.lastName ?? ""}`.trim()
          : null,
      };
    }

    return {
      ...sanitizeDocumentResponse(doc),
      documentPath: doc.documentPath,
      ownerType: "APPLICANT",
      ownerId: loanApplication.id,
      ownerName:
        `${loanApplication.customer.firstName} ${loanApplication.customer.lastName ?? ""}`.trim(),
    };
  });
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
    const existingDoc = await tx.document.findFirst({
      where: {
        loanApplicationId,
        documentType,
      },
    });

    if (!existingDoc) {
      throw AppError.notFound(
        `Document ${documentType} not found. Upload first.`,
      );
    }

    if (existingDoc.documentPath) {
      let filePath = existingDoc.documentPath;
      if (filePath.startsWith("/")) {
        filePath = filePath.slice(1);
      }
      const oldFilePath = path.join(process.cwd(), filePath);

      try {
        fs.unlinkSync(oldFilePath);
      } catch (err: any) {
        if (err.code !== "ENOENT") {
          console.error(`Failed to delete old file: ${oldFilePath}`, err);
        }
      }
    }

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

    return sanitizeDocumentResponse(updatedDocument);
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
      throw AppError.notFound("Employee record not found for user");
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
      select: {
        id: true,
        loanNumber: true,
        status: true,
        dpd: true,
        requestedAmount: true,
        approvedAmount: true,
        interestRate: true,
        tenureMonths: true,
        loanPurpose: true,
        createdAt: true,
        updatedAt: true,
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dob: true,
            contactNumber: true,
            email: true,
            gender: true,
            maritalStatus: true,
            nationality: true,
            category: true,
            alternateNumber: true,
          },
        },
        loanType: {
          select: {
            id: true,
            name: true,
          },
        },
        branch: {
          select: {
            id: true,
            name: true,
          },
        },
        kyc: {
          select: {
            status: true,
            documents: {
              select: { id: true, verificationStatus: true },
            },
          },
        },
        coapplicants: {
          select: { id: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.loanApplication.count({ where }),
  ]);

  const sanitizedData = data.map((loan) => ({
    id: loan.id,
    loanNumber: loan.loanNumber,
    status: loan.status,
    dpd: loan.dpd,
    interestRate: loan.interestRate,
    requestedAmount: loan.requestedAmount,
    approvedAmount: loan.approvedAmount,
    tenureMonths: loan.tenureMonths,
    loanPurpose: loan.loanPurpose,
    createdAt: loan.createdAt,
    updatedAt: loan.updatedAt,
    customer: {
      id: loan.customer.id,
      firstName: loan.customer.firstName,
      lastName: loan.customer.lastName,
      name: `${loan.customer.firstName} ${loan.customer.lastName}`,
      email: loan.customer.email,
      contactNumber: loan.customer.contactNumber,
      dob: loan.customer.dob,
      gender: loan.customer.gender,
      maritalStatus: loan.customer.maritalStatus,
      nationality: loan.customer.nationality,
      category: loan.customer.category,
      alternateNumber: loan.customer.alternateNumber,
    },
    loanTypeId: loan.loanType?.id || null,
    loanTypeName: loan.loanType?.name || null,
    branchId: loan.branch?.id || null,
    branchName: loan.branch?.name || null,
    kycStatus: loan.kyc?.status,
    documentCount: loan.kyc?.documents?.length || 0,
    totalDocuments: loan.kyc?.documents?.length || 0,
    verifiedDocuments: loan.kyc?.documents
      ? loan.kyc.documents.filter((d) => d.verificationStatus === "verified")
          .length
      : 0,
    rejectedDocuments: loan.kyc?.documents
      ? loan.kyc.documents.filter((d) => d.verificationStatus === "rejected")
          .length
      : 0,
    coApplicantCount: loan.coapplicants?.length || 0,
  }));

  // Compute total outstanding amount (approximate): use approvedAmount when available, else requestedAmount
  const totalOutstandingAmount = sanitizedData.reduce((sum, ln) => {
    const amt = Number(ln.approvedAmount ?? ln.requestedAmount ?? 0);
    return sum + (Number.isFinite(amt) ? amt : 0);
  }, 0);

  return {
    data: sanitizedData,
    meta: buildPaginationMeta(total, page, limit),
    totalOutstandingAmount,
  };
};

export const getLoanApplicationByIdService = async (
  id: string,
  user?: { id: string; role: Enums.Role },
) => {
  const loanApplication = await prisma.loanApplication.findUnique({
    where: { id },
    include: {
      customer: {
        include: {
          addresses: true,
          financialDetails: true,
          employmentDetails: true,
        },
      },
      loanType: true,
      kyc: {
        include: {
          documents: true,
        },
      },
      coapplicants: {
        include: {
          documents: true,
        },
      },
      guarantors: {
        include: {
          documents: true,
        },
      },
      bankAccounts: true,
      branch: { select: { id: true, name: true } },
    },
  });

  if (!loanApplication) {
    throw AppError.notFound("Loan application not found");
  }

  if (user) {
    let userBranchId: string | undefined;
    if (user.role === "EMPLOYEE") {
      const employee = await prisma.employee.findUnique({
        where: { userId: user.id },
        select: { branchId: true },
      });

      if (!employee) {
        throw AppError.notFound("Employee record not found");
      }

      userBranchId = employee.branchId;
    }

    const accessibleBranches = await getAccessibleBranchIds({
      id: user.id,
      role: user.role,
      branchId: userBranchId,
    });

    if (
      Array.isArray(accessibleBranches) &&
      !accessibleBranches.includes(loanApplication.branchId)
    ) {
      throw AppError.forbidden("Unauthorized: No access to this loan");
    }
  }

  return loanApplication;
};

type StatusUpdate = {
  status: Enums.LoanStatus;
};

export const updateLoanApplicationStatusService = async (
  id: string,
  statusData: StatusUpdate,
  userId: string,
) => {
  const existingLoan = await prisma.loanApplication.findUnique({
    where: { id },
    select: { status: true, branchId: true },
  });

  if (!existingLoan) {
    throw AppError.notFound("Loan application not found");
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

  return {
    id: updatedLoanApplication.id,
    loanNumber: updatedLoanApplication.loanNumber,
    status: updatedLoanApplication.status,
    requestedAmount: updatedLoanApplication.requestedAmount,
    approvedAmount: updatedLoanApplication.approvedAmount,
    customer: {
      id: updatedLoanApplication.customer.id,
      name: `${updatedLoanApplication.customer.firstName} ${updatedLoanApplication.customer.lastName}`,
    },
    kycStatus: updatedLoanApplication.kyc?.status,
    updatedAt: updatedLoanApplication.updatedAt,
  };
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

  if (!loan) throw AppError.notFound("Loan not found");

  if (loan.status !== "application_in_progress") {
    throw AppError.badRequest("Loan not eligible for review");
  }

  const updated = await prisma.loanApplication.update({
    where: { id: loanId },
    data: { status: "under_review" },
  });

  return {
    id: updated.id,
    loanNumber: updated.loanNumber,
    status: updated.status,
    updatedAt: updated.updatedAt,
  };
};

export const approveLoanService = async (
  loanId: string,
  userId: string,
  data: ApproveLoanInput,
) => {
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
    throw AppError.notFound("Loan application not found");
  }

  if (existingLoan.status !== "under_review") {
    throw AppError.badRequest("Loan not ready for approval");
  }

  let emiStartDateNormalized: Date | undefined = undefined;
  if (data.emiStartDate !== undefined && data.emiStartDate !== null) {
    if (typeof data.emiStartDate === "string") {
      if (/^\d{4}-\d{2}-\d{2}$/.test(data.emiStartDate)) {
        emiStartDateNormalized = new Date(data.emiStartDate + "T00:00:00.000Z");
      } else {
        const parsed = new Date(data.emiStartDate);
        if (isNaN(parsed.getTime()))
          throw AppError.badRequest("Invalid emiStartDate");
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
    throw AppError.badRequest("Loan not ready for approval");
  }

  const loandata = await prisma.loanApplication.findUnique({
    where: { id: loanId },
  });

  if (!loandata) {
    throw AppError.notFound("Loan application not found after approval");
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

  return {
    id: loandata.id,
    loanNumber: loandata.loanNumber,
    status: loandata.status,
    approvedAmount: loandata.approvedAmount,
    tenureMonths: loandata.tenureMonths,
    interestRate: loandata.interestRate,
    emiAmount: loandata.emiAmount,
    approvalDate: loandata.approvalDate,
    updatedAt: loandata.updatedAt,
  };
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
    throw AppError.notFound("Loan application not found");
  }

  if (loan.status !== "under_review") {
    throw AppError.badRequest(
      "Loan not ready for rejection. Only loans under review can be rejected.",
    );
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

  return {
    id: updatedLoan.id,
    loanNumber: updatedLoan.loanNumber,
    status: updatedLoan.status,
    rejectionReason: updatedLoan.rejectionReason,
    updatedAt: updatedLoan.updatedAt,
  };
};

export const createFullLoanApplicationService = async (
  data: FullLoanApplicationInput,
  userId: string,
) => {
  const MAX_ATTEMPTS = 3;
  let attempt = 0;
  while (true) {
    attempt += 1;
    try {
      return await prisma.$transaction(async (tx) => {
        if (!data.loanTypeId) {
          throw AppError.badRequest("loanTypeId is required");
        }

        const branchId = await getUserBranchId(tx, userId);
        const loanTypeId = await validateLoanTypeId(tx, data.loanTypeId);
        const loanNumber = await generateLoanNumber(tx);

        const customer = await createCustomer(tx, data);
        await createAddress(tx, customer.id, data.addresses);
        await ensureNoActiveLoan(tx, customer.id);

        const loan = await createLoan(tx, {
          loanNumber,
          data,
          customerId: customer.id,
          loanTypeId,
          branchId,
          userId,
        });

        const kyc = await createKYC(tx, userId);
        await attachKycToLoan(tx, loan.id, kyc.id);
        await createCoApplicants(
          tx,
          loan.id,
          userId,
          customer.id,
          data.coApplicants,
        );

        await createOccupationalDetailsForEntity(
          tx,
          { customerId: customer.id },
          data.occupationalDetails,
        );
        await createEmploymentDetailsForEntity(
          tx,
          { customerId: customer.id },
          data.employmentDetails,
        );
        if (data.financialDetails) {
          await tx.financialDetails.create({
            data: { customerId: customer.id, ...data.financialDetails },
          });
        }

        await createGuarantors(tx, loan.id, customer.id, data.guarantors);

        await createFinancialDetails(tx, data, loan.id);

        await logAction({
          entityType: "LOAN",
          entityId: loan.id,
          action: "CREATE_LOAN",
          performedBy: userId,
          branchId,
          oldValue: null,
          newValue: {
            loanNumber: loan.loanNumber,
            status: loan.status,
            loanTypeId: data.loanTypeId,
            requestedAmount: data.loanRequirement.loanAmount,
          },
        });

        return {
          id: loan.id,
          loanNumber: loan.loanNumber,
          status: loan.status,
          requestedAmount: loan.requestedAmount,
          loanTypeId: loan.loanTypeId,
          branchId: loan.branchId,
          createdAt: loan.createdAt,
        };
      });
    } catch (error) {
      const err: any = error;
      // Unique constraint on loan number (P2002) — retry a few times
      if (err?.code === "P2002" && attempt < MAX_ATTEMPTS) {
        // small backoff
        await new Promise((r) => setTimeout(r, 50 * attempt));
        continue;
      }
      if (err?.code === "P2002") {
        throw AppError.conflict("Loan number already exists");
      }
      throw error;
    }
  }
};

export const listofalldocumentsForLoanService = async (loanId: string) => {
  const loan = await prisma.loanApplication.findUnique({
    where: { id: loanId },
  });

  if (!loan) {
    throw AppError.notFound("Loan application not found");
  }
  if (loan.loanTypeId) {
    const loanType = await prisma.loanType.findUnique({
      where: { id: loan.loanTypeId },
      select: {
        applicantDocumentsRequired: true,
        coApplicantDocumentsRequired: true,
        guarantorDocumentsRequired: true,
        applicantDocumentsOptional: true,
        coApplicantDocumentsOptional: true,
        guarantorDocumentsOptional: true,
      },
    });
    if (!loanType) {
      throw AppError.notFound("Loan type not found");
    }
    const applicantRequiredDocuments = loanType.applicantDocumentsRequired
      ? parseLoanDocumentCsv(loanType.applicantDocumentsRequired)
      : [];
    const coApplicantRequiredDocuments = loanType.coApplicantDocumentsRequired
      ? parseLoanDocumentCsv(loanType.coApplicantDocumentsRequired)
      : [];
    const guarantorRequiredDocuments = loanType.guarantorDocumentsRequired
      ? parseLoanDocumentCsv(loanType.guarantorDocumentsRequired)
      : [];

    const applicantOptionalDocuments = loanType.applicantDocumentsOptional
      ? parseLoanDocumentCsv(loanType.applicantDocumentsOptional)
      : [];
    const coApplicantOptionalDocuments = loanType.coApplicantDocumentsOptional
      ? parseLoanDocumentCsv(loanType.coApplicantDocumentsOptional)
      : [];
    const guarantorOptionalDocuments = loanType.guarantorDocumentsOptional
      ? parseLoanDocumentCsv(loanType.guarantorDocumentsOptional)
      : [];

    const requiredDocuments = [
      ...applicantRequiredDocuments.map((doc) => ({
        documentType: doc,
        ownerType: "APPLICANT",
      })),
      ...coApplicantRequiredDocuments.map((doc) => ({
        documentType: doc,
        ownerType: "CO_APPLICANT",
      })),
      ...guarantorRequiredDocuments.map((doc) => ({
        documentType: doc,
        ownerType: "GUARANTOR",
      })),
    ];

    const optionalDocuments = [
      ...applicantOptionalDocuments.map((doc) => ({
        documentType: doc,
        ownerType: "APPLICANT",
      })),
      ...coApplicantOptionalDocuments.map((doc) => ({
        documentType: doc,
        ownerType: "CO_APPLICANT",
      })),
      ...guarantorOptionalDocuments.map((doc) => ({
        documentType: doc,
        ownerType: "GUARANTOR",
      })),
    ];
    return {
      requiredDocuments,
      optionalDocuments,
    };
  }
  return {
    requiredDocuments: [],
    optionalDocuments: [],
  };
};
