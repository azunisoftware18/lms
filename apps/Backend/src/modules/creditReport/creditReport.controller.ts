import { Request, Response } from "express";
import { refreshCreditReportService } from "./creditReport.service.js";
import { getCreditProvider } from "./creditProvider.factory.js";
import { prisma } from "../../db/prismaService.js";
import { AppError } from "../../common/utils/apiError.js";

const creditProvider = getCreditProvider();

export const refreshCreditReportController = async (
  req: Request,
  res: Response,
) => {
  try {
    // Auth check
    if (!req.user) {
      throw AppError.unauthorized("Unauthorized");
    }

    // Params & body
    const { id } = req.params as { id: string };
    const { reason } = req.body as { reason: string };

    // Validations
    if (!id || typeof id !== "string") {
      throw AppError.badRequest("Customer ID is required");
    }

    if (!reason || typeof reason !== "string") {
      throw AppError.badRequest("Reason for refreshing credit report is required");
    }

    // =====================================================
    // Find customer
    // =====================================================
    const customer = await prisma.customer.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!customer) {
      throw AppError.notFound("Customer not found");
    }

    // =====================================================
    // Call service
    // =====================================================
    const report = await refreshCreditReportService(
      { customerId: customer.id },
      creditProvider,
      {
        requestedBy: req.user.id,
        reason,
        branchId: req.user.branchId,
      },
    );

    // =====================================================
    // Success response
    // =====================================================
    return res.status(200).json({
      success: true,
      message: "Credit report refreshed successfully",
      data: report,
    });

  } catch (error: any) {
    console.error("❌ Refresh Credit Error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};