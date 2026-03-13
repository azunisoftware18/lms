import { Request, Response } from "express";
import { prisma } from "../../db/prismaService.js";
import { AppError } from "../../common/utils/apiError.js";
import {
  getEmiAmountService,
  getLoanEmiService,
  generateEmiScheduleService,
  markEmiPaidService,
  getThisMonthEmiAmountService,
  payforecloseLoanService,
  getAllEmisService,
  applyMoratoriumService,
  getPayableEmiAmountService,
  editEmiService,
} from "./emi.service.js";
import {
  processOverdueEmis,
  payEmiService,
  forecloseLoanService,
} from "./emi.service.js";

const getParam = (req: Request, key: string) => {
  const value = req.params[key as keyof typeof req.params];
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0] || "";
  return "";
};

const requireActor = (req: Request) => {
  const userId = typeof req.user?.id === "string" ? req.user.id.trim() : "";
  const branchId =
    typeof req.user?.branchId === "string" ? req.user.branchId.trim() : "";

  if (!userId || !branchId) {
    throw AppError.badRequest("User id and branch id are required");
  }

  return { userId, branchId };
};

const hasBranchAccess = (req: Request, branchId: string) => {
  const accessibleBranchIds = (req as any).accessibleBranchIds as string[] | null | undefined;
  if (accessibleBranchIds == null) return true;
  return accessibleBranchIds.includes(branchId);
};

const ensureLoanBranchAccess = async (req: Request, loanId: string) => {
  const loan = await prisma.loanApplication.findUnique({
    where: { id: loanId },
    select: { branchId: true },
  });

  if (!loan) {
    throw AppError.notFound("Loan application not found");
  }

  if (!hasBranchAccess(req, loan.branchId)) {
    throw AppError.forbidden("You are not allowed to access this loan");
  }
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

export const getAllEmisController = async (req: Request, res: Response) => {
  try {
    const result = await getAllEmisService({
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      q: typeof req.query.q === 'string' ? req.query.q : undefined,
      status: typeof req.query.status === 'string' ? req.query.status : undefined,
      accessibleBranchIds: (req as any).accessibleBranchIds,
    });

    return res.status(200).json({
      success: true,
      message: "EMIs retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to retrieve EMIs",
      error: error.message || "INTERNAL_SERVER_ERROR",
    });
  }
};

export const generateEmiScheduleController = async (
  req: Request,
  res: Response,
) => {
  try {
    const loanId = getParam(req, "id");
    const { userId, branchId } = requireActor(req);

    if (!loanId) {
      throw AppError.badRequest("Loan id is required");
    }

    await ensureLoanBranchAccess(req, loanId);

    const schedule = await generateEmiScheduleService(loanId, userId, branchId);
    res.status(200).json({ success: true, data: schedule });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to generate EMI schedule",
      error: error.message || "INTERNAL_SERVER_ERROR",
    });
  }
};

export const getThisMonthEmiAmountController = async (
  req: Request,
  res: Response,
) => {
  try {
    const loanApplicationId = getParam(req, "loanApplicationId");

    if (!loanApplicationId) {
      throw AppError.badRequest("Loan application id is required");
    }

    await ensureLoanBranchAccess(req, loanApplicationId);

    const result = await getThisMonthEmiAmountService(loanApplicationId);

    res.status(200).json({
      success: true,
      message: "This month EMI amount fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch EMI amount",
    });
  }
};

export const getLoanEmiController = async (req: Request, res: Response) => {
  try {
    const loanId = getParam(req, "id");
    if (!loanId) {
      throw AppError.badRequest("Loan id is required");
    }
    await ensureLoanBranchAccess(req, loanId);
    const emis = await getLoanEmiService(loanId);
    res.status(200).json({
      success: true,
      data: emis,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch EMI schedule",
      error: error.message || "INTERNAL_SERVER_ERROR",
    });
  }
};

export const markEmiPaidController = async (req: Request, res: Response) => {
  try {
    const { amountPaid, paymentMode } = req.body;
    const emiId = getParam(req, "emiId");
    const { userId, branchId } = requireActor(req);

    if (!emiId) {
      throw AppError.badRequest("EMI id is required");
    }

    await ensureEmiBranchAccess(req, emiId);

    const emi = await markEmiPaidService({
      emiId,
      amountPaid,
      paymentMode,
      paidByUserId: userId,
      branchId,
    });

    res.status(200).json({ success: true, data: emi });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to mark EMI as paid",
    });
  }
};

export const getEmiPayableAmountController = async (
  req: Request,
  res: Response,
) => {
  try {
    const emiId = getParam(req, "emiId");
    if (!emiId) {
      throw AppError.badRequest("EMI id is required");
    }
    await ensureEmiBranchAccess(req, emiId);
    const emi = await getPayableEmiAmountService(emiId);
    res.status(200).json({ success: true, data: emi });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to get payable EMI amount",
    });
  }
};
export const generateEmiAmount = async (req: Request, res: Response) => {
  try {
    const { principal, annualInterestRate, tenureMonths, interestType } =
      req.body;
    const { emiAmount, totalPayable } = await getEmiAmountService({
      principal,
      annualInterestRate,
      tenureMonths,
      interestType,
    });
    res.status(200).json({ success: true, data: { emiAmount, totalPayable } });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to calculate EMI amount",
      error: error.message || "INTERNAL_SERVER_ERROR",
    });
  }
};

// export const processOverdueEmisController = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     const processedCount = await processOverdueEmis();

//     return res.status(200).json({
//       success: true,
//       message:
//         processedCount === 0
//           ? "No overdue EMIs to process"
//           : `${processedCount} EMI(s) marked as overdue`,
//       data: {
//         processedCount,
//       },
//     });
//   } catch (error: any) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to process overdue EMIs",
//       error: error.message,
//     });
//   }
// };

export const payEmiServiceController = async (req: Request, res: Response) => {
  try {
    const emiId = getParam(req, "emiId");
    if (!emiId) {
      throw AppError.badRequest("EMI id is required");
    }
    await ensureEmiBranchAccess(req, emiId);
    const { amount, paymentMode } = req.body;
    const emi = await payEmiService(emiId, amount, paymentMode);

    res.status(200).json({ success: true, data: emi });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to pay EMI",
      error: error.message || "INTERNAL_SERVER_ERROR",
    });
  }
};

export const forecloseLoanController = async (req: Request, res: Response) => {
  try {
    const loanId = getParam(req, "loanId");
    if (!loanId) {
      throw AppError.badRequest("Loan id is required");
    }
    await ensureLoanBranchAccess(req, loanId);
    // Implement foreclose loan logic here
    const result = await forecloseLoanService(loanId);
    res.status(200).json({
      success: true,
      message: "Loan foreclosed successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to foreclose loan",
      error: error.message || "INTERNAL_SERVER_ERROR",
    });
  }
};

export const payforecloseLoanController = async (
  req: Request,
  res: Response,
) => {
  try {
    const loanId = getParam(req, "loanId");
    const { userId, branchId } = requireActor(req);
    if (!loanId) {
      throw AppError.badRequest("Loan id is required");
    }
    await ensureLoanBranchAccess(req, loanId);
    const data = req.body;
    // Implement foreclose loan logic here
    const result = await payforecloseLoanService(
      loanId,
      data,
      userId,
      branchId,
    );
    res.status(200).json({
      success: true,
      message: "Loan foreclosed successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to foreclose loan",
      error: error.message || "INTERNAL_SERVER_ERROR",
    });
  }
};
export const applyMoratoriumController = async (
  req: Request,
  res: Response,
) => {
  try {
    const loanId = getParam(req, "loanId");
    const { userId, branchId } = requireActor(req);
    const { type, startDate, endDate } = req.body;

    if (!loanId || !type || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    await ensureLoanBranchAccess(req, loanId);

    const result = await applyMoratoriumService({
      loanId,
      type,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      userId,
      branchId,
    });
    res.status(200).json({
      success: true,
      message: "Moratorium applied successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to apply moratorium",
      error: error.message || "INTERNAL_SERVER_ERROR",
    });
  }
};
export const editEmiController = async (req: Request, res: Response) => {
  try {
    const emiId = getParam(req, "emiId");
    const { userId, branchId } = requireActor(req);

    if (!emiId) {
      throw AppError.badRequest("EMI id is required");
    }

    await ensureEmiBranchAccess(req, emiId);

    const { dueDate } = req.body;

    if (!dueDate) {
      return res.status(400).json({
        success: false,
        message: "dueDate is required",
      });
    }

    const updatedEmi = await editEmiService(
      emiId,
      new Date(dueDate),
      userId,
      branchId,
    );

    res.status(200).json({
      success: true,
      message: "EMI updated successfully",
      data: updatedEmi,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update EMI",
      error: error.message || "INTERNAL_SERVER_ERROR",
    });
  }
};
