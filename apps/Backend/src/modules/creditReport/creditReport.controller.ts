import { Request, Response } from "express";
import { refreshCreditReportService } from "./creditReport.service.js";
import { getCreditProvider } from "./creditProvider.factory.js";
import { prisma } from "../../db/prismaService.js";
import { buildCreditReportSearch } from "../../common/utils/search.js";

const creditProvider = getCreditProvider();

export const refreshCreditReportController = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const q =
      req.query.q?.toString() ||
      (typeof req.body?.q === "string" ? req.body.q : undefined);

    const { reason } = req.body;

    if (!q) {
      return res.status(400).json({
        message: "Search query (q) is required",
      });
    }

    if (!reason) {
      return res.status(400).json({
        message: "Reason for refreshing credit report is required",
      });
    }

    // Normalize query
    const qNorm = q.trim();

    // ✅ Search CUSTOMER by customer fields
    let customer = await prisma.customer.findFirst({
      where: {
        OR: [
          { panNumber: qNorm },
          { aadhaarNumber: qNorm },
          { contactNumber: qNorm },
        ],
      },
      select: { id: true },
    });

    // If not found by customer, try CoApplicant (linked to a loan application)
    if (!customer) {
      const coapp = await prisma.coApplicant.findFirst({
        where: {
          OR: [
            { panNumber: qNorm },
            { aadhaarNumber: qNorm },
            { contactNumber: qNorm },
          ],
        },
        include: { loanApplication: { select: { customerId: true } } },
      });

      if (coapp?.loanApplication?.customerId) {
        customer = { id: coapp.loanApplication.customerId };
      }
    }

    // If still not found, try Guarantor (linked to a loan application)
    if (!customer) {
      const guarantor = await prisma.guarantor.findFirst({
        where: {
          OR: [
            { panNumber: qNorm },
            { aadhaarNumber: qNorm },
            { contactNumber: qNorm },
          ],
        },
        include: { loanApplication: { select: { customerId: true } } },
      });

      if (guarantor?.loanApplication?.customerId) {
        customer = { id: guarantor.loanApplication.customerId };
      }
    }

    // If still not found, try exact loan number lookup
    if (!customer) {
      const loanApplication = await prisma.loanApplication.findFirst({
        where: { loanNumber: qNorm },
        select: { customerId: true },
      });

      if (loanApplication) {
        customer = { id: loanApplication.customerId };
      }
    }

    // If we have a direct customer id, use it. Otherwise fall back to service-level search by `q`.
    let report;
    try {
      if (customer) {
        report = await refreshCreditReportService(
          { customerId: customer.id },
          creditProvider,
          {
            requestedBy: req.user.id,
            reason,
            branchId: req.user.branchId,
          },
        );
      } else {
        // Let the service attempt to resolve `q` using existing reports/search helpers
        report = await refreshCreditReportService(
          { q: qNorm },
          creditProvider,
          {
            requestedBy: req.user.id,
            reason,
            branchId: req.user.branchId,
          },
        );
      }
    } catch (err: any) {
      // Convert service-level "Customer not found" into 404 for the client
      if (err?.message && err.message.toLowerCase().includes("customer not found")) {
        return res.status(404).json({
          message: "Customer not found for the search query (PAN, Aadhaar, Contact, or Loan Number)",
        });
      }
      throw err;
    }

    return res.status(200).json({
      success: true,
      message: "Credit report refreshed successfully",
      data: report,
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};