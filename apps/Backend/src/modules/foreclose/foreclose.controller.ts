import { Request, Response } from "express";
import PDFDocument from "pdfkit";
import {
  forecloseLoanService,
  payforecloseLoanService,
  applyForecloseLoanService,
  approveForecloseService,
} from "./foreclose.service.js";
import { AppError } from "../../common/utils/apiError.js";
import { prisma } from "../../db/prismaService.js";

const sanitizeErrorMessage = (error: any) => {
  if (!error) return "INTERNAL_SERVER_ERROR";
  const msg = typeof error.message === "string" ? error.message : String(error);
  const lines = msg
    .split(/\r?\n/)
    .map((l: string) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return msg;
  const last = lines[lines.length - 1];
  if (last.length > 200) return "Database error";
  return last;
};

const getParam = (req: Request, key: string) => {
  const value = req.params[key as keyof typeof req.params];
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0] || "";
  return "";
};

const requireActor = (req: Request) => {
  // Prefer authenticated user from middleware, but accept fallbacks from request body
  const body = (req as any).body || {};

  const userId =
    typeof req.user?.id === "string"
      ? req.user.id.trim()
      : typeof body.userId === "string"
        ? body.userId.trim()
        : typeof body.user_id === "string"
          ? body.user_id.trim()
          : typeof body.createdBy === "string"
            ? body.createdBy.trim()
            : "";

  const branchId =
    typeof req.user?.branchId === "string"
      ? req.user.branchId.trim()
      : typeof body.branchId === "string"
        ? body.branchId.trim()
        : typeof body.branch_id === "string"
          ? body.branch_id.trim()
          : "";

  if (!userId || !branchId) {
    throw AppError.badRequest("User id and branch id are required");
  }

  return { userId, branchId };
};

const hasBranchAccess = (req: Request, branchId: string) => {
  const accessibleBranchIds = (req as any).accessibleBranchIds as
    | string[]
    | null
    | undefined;
  if (accessibleBranchIds == null) return true;
  return accessibleBranchIds.includes(branchId);
};

const ensureLoanBranchAccess = async (req: Request, loanKey: string) => {
  // Debug: log incoming key and params

  // Try by primary id first
  let loan = await prisma.loanApplication.findUnique({
    where: { id: loanKey },
    select: { id: true, branchId: true, loanNumber: true },
  });
  if (loan)
    console.debug("[foreclose] found by id", {
      id: loan.id,
      loanNumber: loan.loanNumber,
    });

  // If not found, try loanNumber exact match
  if (!loan) {
    loan = await prisma.loanApplication.findUnique({
      where: { loanNumber: loanKey },
      select: { id: true, branchId: true, loanNumber: true },
    });
    if (loan)
      console.debug("[foreclose] found by exact loanNumber", {
        id: loan.id,
        loanNumber: loan.loanNumber,
      });
  }

  // Fallback: sanitized / partial match (handles formats like LN-2026-000001)
  if (!loan) {
    try {
      const sanitized = String(loanKey)
        .replace(/[^A-Za-z0-9]/g, "")
        .trim();
      console.debug("[foreclose] sanitized loanKey", { sanitized });
      if (sanitized) {
        loan = await prisma.loanApplication.findFirst({
          where: {
            OR: [
              { loanNumber: { equals: loanKey } },
              { loanNumber: { contains: sanitized } },
            ],
          },
          select: { id: true, branchId: true, loanNumber: true },
        });
        if (loan)
          console.debug("[foreclose] found by sanitized/partial", {
            id: loan.id,
            loanNumber: loan.loanNumber,
          });
      }
    } catch (e) {
      // ignore and proceed to not-found
    }
  }

  if (!loan) {
    throw AppError.notFound("Loan application not found");
  }

  if (!hasBranchAccess(req, loan.branchId)) {
    throw AppError.forbidden("You are not allowed to access this loan");
  }

  return loan;
};

const ensureEmiBranchAccess = async (req: Request, emiId: string) => {
  const emi = await prisma.loanEmiSchedule.findUnique({
    where: { id: emiId },
    select: { loanApplication: { select: { branchId: true } } },
  });

  if (!emi?.loanApplication) {
    throw AppError.notFound("EMI not found");
  }

  if (!hasBranchAccess(req, emi.loanApplication.branchId)) {
    throw AppError.forbidden("You are not allowed to access this EMI");
  }
};
export const forecloseLoanController = async (req: Request, res: Response) => {
  try {
    const loanId = getParam(req, "loanId");
    if (!loanId) throw new Error("Loan id is required");
    const loan = await ensureLoanBranchAccess(req, loanId);
    const result = await forecloseLoanService(loan.id);
    res.status(200).json({
      success: true,
      message: "Foreclose summary fetched",
      data: result,
    });
  } catch (error: any) {
    res.status(error?.statusCode || 500).json({
      success: false,
      message:
        sanitizeErrorMessage(error) || "Failed to fetch foreclose summary",
      error: sanitizeErrorMessage(error) || "INTERNAL_SERVER_ERROR",
    });
  }
};

export const applyForecloseController = async (req: Request, res: Response) => {
  try {
    const loanNumber = getParam(req, "loanNumber");
    const { userId, branchId } = requireActor(req);
    if (!loanNumber) throw new Error("Loan number is required");
    const loan = await ensureLoanBranchAccess(req, loanNumber);
    const result = await applyForecloseLoanService(
      loan.id,
      userId,
      branchId,
      true,
    );
    res.status(200).json({
      success: true,
      message: "Loan foreclose application submitted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error?.statusCode || 500).json({
      success: false,
      message:
        sanitizeErrorMessage(error) || "Failed to apply for loan foreclose",
      error: sanitizeErrorMessage(error) || "INTERNAL_SERVER_ERROR",
    });
  }
};

export const payforecloseLoanController = async (
  req: Request,
  res: Response,
) => {
  try {
    // support either /loans/:loanId or /loans/:loanNumber
    const loanId = getParam(req, "loanId") || getParam(req, "loanNumber");
    const { userId, branchId } = requireActor(req);
    if (!loanId) throw new Error("Loan id is required");
    const loan = await ensureLoanBranchAccess(req, loanId);
    const data = req.body;
    const result = await payforecloseLoanService(
      loan.id,
      data,
      userId,
      branchId,
    );

    // Format response for clarity
    const formatNumber = (v: any) =>
      typeof v === "number" ? Number(v.toFixed?.(2) ?? v) : v;
    const fmtDate = (d: any) =>
      d ? (d instanceof Date ? d.toISOString() : String(d)) : null;

    const summary = {
      remainingPrincipal: formatNumber(result.remainingPrincipal),
      accruedInterest: formatNumber(result.accruedInterest),
      penalty: formatNumber(
        result.foreclosurePenalty ?? result?.foreClosure?.penalty ?? 0,
      ),
      unpaidEmiCharges: formatNumber(result.unpaidEmiCharges),
      totalPayable: formatNumber(result.totalPayable),
    };

    const payment = {
      amountPaid: formatNumber(result.amountPaid),
      paymentMode: data.paymentMode || result?.foreClosure?.paymentMode || null,
      settlementReference:
        data.settlementReference ||
        data.reference ||
        result?.foreClosure?.settlementReference ||
        null,
      settledAt: fmtDate(result?.foreClosure?.settledAt),
    };

    const closure = result?.foreClosure
      ? {
          id: result.foreClosure.id,
          loanApplicationId: result.foreClosure.loanApplicationId,
          appliedBy: result.foreClosure.appliedBy || null,
          appliedAt: fmtDate(result.foreClosure.appliedAt),
          principalOutstanding: formatNumber(
            result.foreClosure.principalOutstanding ??
              result.remainingPrincipal,
          ),
          interestAccrued: formatNumber(
            result.foreClosure.interestAccrued ?? result.accruedInterest,
          ),
          unpaidEmiCharges: formatNumber(
            result.foreClosure.unpaidEmiCharges ?? result.unpaidEmiCharges,
          ),
          penalty: formatNumber(
            result.foreClosure.penalty ?? result.foreclosurePenalty ?? 0,
          ),
          totalPayable: formatNumber(
            result.foreClosure.totalPayable ?? result.totalPayable,
          ),
          approvalStatus: result.foreClosure.approvalStatus || null,
          foreclosureApprovedBy:
            result.foreClosure.foreclosureApprovedBy || null,
          foreclosureApprovedAt: fmtDate(
            result.foreClosure.foreclosureApprovedAt,
          ),
          settledAmount: formatNumber(
            result.foreClosure.settledAmount ?? result.amountPaid,
          ),
          settledAt: fmtDate(result.foreClosure.settledAt),
          settlementReference: result.foreClosure.settlementReference || null,
          paymentMode: result.foreClosure.paymentMode || null,
          settlementReceiptUrl: result.foreClosure.settlementReceiptUrl || null,
          reason: result.foreClosure.reason || null,
          createdAt: fmtDate(result.foreClosure.createdAt),
          updatedAt: fmtDate(result.foreClosure.updatedAt),
        }
      : null;

    res.status(200).json({
      success: true,
      message: "Loan foreclosed successfully",
      data: { summary, payment, foreClosure: closure },
    });
  } catch (error: any) {
    res.status(error?.statusCode || 500).json({
      success: false,
      message: sanitizeErrorMessage(error) || "Failed to foreclose loan",
      error: sanitizeErrorMessage(error) || "INTERNAL_SERVER_ERROR",
    });
  }
};

export const approveForecloseController = async (
  req: Request,
  res: Response,
) => {
  try {
    const loanNumber = getParam(req, "loanNumber");
    const { userId, branchId } = requireActor(req);
    let approve: boolean | undefined = req.body?.approve;
    if (typeof approve === "string") approve = approve === "true";
    if (typeof approve !== "boolean")
      throw AppError.badRequest(
        "Body parameter 'approve' (boolean) is required",
      );
    if (!loanNumber) throw new Error("Loan number is required");
    const loan = await ensureLoanBranchAccess(req, loanNumber);
    const result = await approveForecloseService(
      loan.id,
      userId,
      branchId,
      approve,
    );
    res.status(200).json({
      success: true,
      message: "Foreclose application approved",
      data: result,
    });
  } catch (error: any) {
    res.status(error?.statusCode || 500).json({
      success: false,
      message:
        sanitizeErrorMessage(error) ||
        "Failed to approve foreclose application",
      error: sanitizeErrorMessage(error) || "INTERNAL_SERVER_ERROR",
    });
  }
};

export const foreclosureStatementController = async (
  req: Request,
  res: Response,
) => {
  try {
    const loanKey = getParam(req, "loanNumber") || getParam(req, "loanId");
    if (!loanKey) throw new Error("Loan id or loan number is required");

    const loan = await ensureLoanBranchAccess(req, loanKey);

    // Fetch loan details and foreclosure summary
    const loanRecord = await prisma.loanApplication.findUnique({
      where: { id: loan.id },
      include: { customer: true, loanType: true },
    });

    const summary = await forecloseLoanService(loan.id);
    const s: any = summary as any;
    const lr: any = loanRecord as any;

    // Prepare PDF
    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=foreclosure_${(loanRecord?.loanNumber ?? loan.id).toString().replace(/\W+/g, "_")}.pdf`,
    );

    doc.pipe(res);

    doc.fontSize(16).text("LOAN FORECLOSURE STATEMENT", { align: "center" });
    doc
      .fontSize(10)
      .text("(System Generated – No Signature Required)", { align: "center" });

    doc.moveDown();

    doc.fontSize(12).text("Bank Details", { underline: true });
    doc.text(`Institution: ${process.env.BANK_NAME || "ABC Bank Ltd."}`);
    doc.text(`Branch: ${process.env.BANK_BRANCH || "Main Branch"}`);
    doc.text(`Contact: ${process.env.BANK_CONTACT || "+91-XXXXXXXXXX"}`);

    doc.moveDown();

    doc.text("Customer Details", { underline: true });
    const customerName = lr?.customer?.firstName
      ? `${lr.customer.firstName} ${lr.customer.lastName ?? ""}`.trim()
      : (lr?.customerName ?? "N/A");

    doc.text(`Name: ${customerName}`);
    doc.text(`Loan A/C No: ${lr?.loanNumber ?? loan.id}`);
    doc.text(`Customer ID: ${lr?.customer?.id ?? lr?.customerId ?? "N/A"}`);

    doc.moveDown();

    doc.text("Loan Details", { underline: true });
    doc.text(
      `Loan Type: ${loanRecord?.loanType?.name ?? loanRecord?.loanType ?? "N/A"}`,
    );
    const sanctioned = lr?.approvedAmount ?? lr?.requestedAmount ?? 0;
    doc.text(`Sanctioned Amount: ₹${sanctioned}`);
    doc.text(`Interest Rate: ${lr?.interestRate ?? 0}%`);

    doc.moveDown();

    doc.text("Foreclosure Calculation", { underline: true });
    doc.text(
      `Principal Outstanding: ₹${s?.remainingPrincipal ?? s?.remaining ?? 0}`,
    );
    doc.text(`Interest Outstanding: ₹${s?.accruedInterest ?? 0}`);
    doc.text(`Penal Charges: ₹${s?.foreclosurePenalty ?? s?.penalty ?? 0}`);
    doc.text(`Foreclosure Charges: ₹${s?.foreclosureCharges ?? 0}`);
    doc.text(`Other Charges: ₹${s?.otherCharges ?? 0}`);

    doc.moveDown();
    doc
      .fontSize(12)
      .text(`Total Foreclosure Amount: ₹${s?.totalPayable ?? 0}`, {
        bold: true,
      });

    doc.moveDown();

    const validTill = s?.validTill ?? s?.valid_till ?? "N/A";
    doc
      .fontSize(10)
      .text(
        `Note: This amount is valid till ${validTill}. Interest will accrue after that.`,
      );

    doc.moveDown();
    doc.text(`Generated On: ${new Date().toLocaleString()}`);

    doc.end();
  } catch (error: any) {
    console.error("Failed to generate foreclosure statement", error);
    res.status(error?.statusCode || 500).json({
      success: false,
      message: sanitizeErrorMessage(error) || "Failed to generate statement",
      error: sanitizeErrorMessage(error) || "INTERNAL_SERVER_ERROR",
    });
  }
};
