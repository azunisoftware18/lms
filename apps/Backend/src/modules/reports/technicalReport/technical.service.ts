import { buildBranchFilter } from "../../../common/utils/branchFilter.js";
import { getAccessibleBranchIds } from "../../../common/utils/branchAccess.js";
import {
  buildPaginationMeta,
  getPagination,
} from "../../../common/utils/pagination.js";
import { buildTechnicalReportSearch } from "../../../common/utils/search.js";
import { prisma } from "../../../db/prismaService.js";


class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const createTechnicalReportService = async (
  loanNumber: string,
  data: any,
  userId: string
) => {
  return prisma.$transaction(async (tx) => {
    // ✅ Find loan by loanNumber
    const loanApplication = await tx.loanApplication.findUnique({
      where: { loanNumber }, // 🔥 must be unique in DB
      select: { id: true, branchId: true },
    });

    if (!loanApplication) {
      throw new AppError("Loan application not found", 404);
    }

    const loanApplicationId = loanApplication.id;

    // ✅ Prevent duplicate report
    const existingReport = await tx.technicalReport.findFirst({
      where: { loanApplicationId },
    });

    if (existingReport) {
      throw new AppError(
        "Technical report already exists for this loan",
        409
      );
    }

    // ✅ Create report
    const report = await tx.technicalReport.create({
      data: {
        ...data,
        loanApplicationId,
        branchId: loanApplication.branchId,
        status: "SUBMITTED",
        submittedAt: new Date(),
      },
    });

    // ✅ Update loan status
    await tx.loanApplication.update({
      where: { id: loanApplicationId },
      data: { status: "TECHNICAL_PENDING" },
    });

    // ✅ Audit log
    await tx.auditLog.create({
      data: {
        entityType: "TECHNICAL_REPORT",
        entityId: report.id,
        action: "CREATE_TECHNICAL_REPORT",
        performedBy: userId,
        branchId: loanApplication.branchId,
      },
    });

    return report;
  });
};

export const approveTechnicalReportService = async (
  reportId: string,
  approved: string,
) => {
  return prisma.$transaction(async (tx) => {
    const report = await tx.technicalReport.update({
      where: { id: reportId },
      data: {
        status: "APPROVED",
        approvedBy: approved,
        approvedAt: new Date(),
      },
    });

    await tx.loanApplication.update({
      where: { id: report.loanApplicationId },
      data: { status: "TECHNICAL_APPROVED" },
    });

    return report;
  });
};

export const getAllTechnicalReportsService = async (
  params: {
    page?: number;
    limit?: number;
    q?: string;
    propertyType?: string;
    constructionStatus?: string;
    city?: string;
  },
  user: {
    id: string;
    role: string;
    branchId: string;
  },
) => {
  const { page, limit, skip } = getPagination(params.page, params.limit);

  const allowedBranchIds = await getAccessibleBranchIds({
    id: user.id,
    role: user.role,
    branchId: user.branchId,
  });

  const where = {
    ...buildTechnicalReportSearch(params.q),
    ...buildBranchFilter(allowedBranchIds),
    // server-side filters
    ...(params.propertyType ? { propertyType: params.propertyType } : {}),
    ...(params.constructionStatus ? { constructionStatus: params.constructionStatus } : {}),
    ...(params.city ? { city: params.city } : {}),
  };

  const [total, data] = await prisma.$transaction([
    prisma.technicalReport.count({ where }),
    prisma.technicalReport.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
  ]);
  return {
    data,
    meta: buildPaginationMeta(total, page, limit),
  };
};


export const editTechnicalReportService = async (
  reportId: string,
  data: any,
  userId: string
) => {
  try {
    const report = await prisma.technicalReport.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      throw new AppError("Technical report not found", 404);
    }
    if (report.status === "APPROVED") {
      throw new AppError("Approved technical report cannot be edited", 400);
    }

    const updatedReport = await prisma.technicalReport.update({
      where: { id: reportId },
      data: {
        ...data,
        // Optionally, you can track who edited the report and when
        lastEditedBy: userId,
        lastEditedAt: new Date(),
      },
    });
    return updatedReport;

  } catch (error) {
    throw new AppError(
      error instanceof AppError ? error.message : "Failed to edit technical report",
      error instanceof AppError ? error.statusCode : 500
    );
  }
};

export const rejectTechnicalReportService = async (
  reportId: string,
  rejectedBy: string
) => {
  try {
    const report = await prisma.technicalReport.findUnique({
      where: { id: reportId },
    });
    if (!report) {
      throw new AppError("Technical report not found", 404);
    }
    if (report.status === "APPROVED") {
      throw new AppError("Approved technical report cannot be rejected", 400);
    }
    const updatedReport = await prisma.technicalReport.update({
      where: { id: reportId },
      data: {

        status: "REJECTED",
        rejectedBy: rejectedBy
      }
    });
    return updatedReport;
  }
  catch (error) {
    throw new AppError(
      error instanceof AppError ? error.message : "Failed to reject technical report",
      error instanceof AppError ? error.statusCode : 500
    );
  }
};

