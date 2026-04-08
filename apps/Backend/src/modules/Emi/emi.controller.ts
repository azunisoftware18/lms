import { Request, Response } from "express";
import { prisma } from "../../db/prismaService.js";
import { AppError } from "../../common/utils/apiError.js";
import {
  getEmiAmountService,
  getLoanEmiService,
  generateEmiScheduleService,
  markEmiPaidService,
  getThisMonthEmiAmountService,
  // payforecloseLoanService,
  getAllEmisService,
  applyMoratoriumService,
  getPayableEmiAmountService,
  editEmiService,
} from "./emi.service.js";
import {
  processOverdueEmis,
  payEmiService,

} from "./emi.service.js";

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
  // Resolve by primary id first, then by loanNumber
  let loan = await prisma.loanApplication.findUnique({
    where: { id: loanKey },
    select: { id: true, branchId: true, loanNumber: true },
  });

  if (!loan) {
    loan = await prisma.loanApplication.findUnique({
      where: { loanNumber: loanKey },
      select: { id: true, branchId: true, loanNumber: true },
    });
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

export const getAllEmisController = async (req: Request, res: Response) => {
  try {
    const result = await getAllEmisService({
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      q: typeof req.query.q === "string" ? req.query.q : undefined,
      status:
        typeof req.query.status === "string" ? req.query.status : undefined,
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
      message: sanitizeErrorMessage(error) || "Failed to retrieve EMIs",
      error: sanitizeErrorMessage(error) || "INTERNAL_SERVER_ERROR",
    });
  }
};

export const generateEmiScheduleController = async (
  req: Request,
  res: Response,
) => {
  try {
    const loanNumber = getParam(req, "id");
    const emiStartDate = req.body.emiStartDate
      ? new Date(req.body.emiStartDate)
      : undefined;
      if (emiStartDate && isNaN(emiStartDate.getTime())) {
        throw AppError.badRequest("Invalid EMI start date");
      }

    const { userId, branchId } = requireActor(req);

    if (!loanNumber) {
      throw AppError.badRequest("Loan number is required");
    }

    const loan = await ensureLoanBranchAccess(req, loanNumber);

    const schedule = await generateEmiScheduleService(
      loan.loanNumber,
      userId,
      branchId,
      emiStartDate
    );
    res.status(200).json({ success: true, data: schedule });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: sanitizeErrorMessage(error) || "Failed to generate EMI schedule",
      error: sanitizeErrorMessage(error) || "INTERNAL_SERVER_ERROR",
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

    const loan = await ensureLoanBranchAccess(req, loanApplicationId);

    const result = await getThisMonthEmiAmountService(loan.id);

    res.status(200).json({
      success: true,
      message: "This month EMI amount fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: sanitizeErrorMessage(error) || "Failed to fetch EMI amount",
    });
  }
};

export const getLoanEmiController = async (req: Request, res: Response) => {
  try {
    const loanId = getParam(req, "id");
    if (!loanId) {
      throw AppError.badRequest("Loan id is required");
    }
    const loan = await ensureLoanBranchAccess(req, loanId);
    const emis = await getLoanEmiService(loan.id);
    res.status(200).json({
      success: true,
      data: emis,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: sanitizeErrorMessage(error) || "Failed to fetch EMI schedule",
      error: sanitizeErrorMessage(error) || "INTERNAL_SERVER_ERROR",
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
      message: sanitizeErrorMessage(error) || "Failed to mark EMI as paid",
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
      message:
        sanitizeErrorMessage(error) || "Failed to get payable EMI amount",
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
      message: sanitizeErrorMessage(error) || "Failed to calculate EMI amount",
      error: sanitizeErrorMessage(error) || "INTERNAL_SERVER_ERROR",
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
      message: sanitizeErrorMessage(error) || "Failed to pay EMI",
      error: sanitizeErrorMessage(error) || "INTERNAL_SERVER_ERROR",
    });
  }
};

// export const forecloseLoanController = async (req: Request, res: Response) => {
//   try {
//     const loanId = getParam(req, "loanId");
//     if (!loanId) {
//       throw AppError.badRequest("Loan id is required");
//     }
//     const loan = await ensureLoanBranchAccess(req, loanId);
//     // Implement foreclose loan logic here
//     const result = await forecloseLoanService(loan.id);
//     res.status(200).json({
//       success: true,
//       message: "Loan foreclosed successfully",
//       data: result,
//     });
//   } catch (error: any) {
//     res.status(error.statusCode || 500).json({
//       success: false,
//       message: sanitizeErrorMessage(error) || "Failed to foreclose loan",
//       error: sanitizeErrorMessage(error) || "INTERNAL_SERVER_ERROR",
//     });
//   }
// };

// export const applyForecloseController = async (req: Request, res: Response) => {
//   try {
//     const loanId = getParam(req, "loanId");
//     const { userId, branchId } = requireActor(req);
//     if (!loanId) {
//       throw AppError.badRequest("Loan id is required");
//     }
//     const loan = await ensureLoanBranchAccess(req, loanId);
//     // Implement foreclose loan logic here
//     const result = await applyForecloseLoanService(loan.id, userId, branchId, true);
//     res.status(200).json({
//       success: true,
//       message: "Loan foreclose application submitted successfully",
//       data: result,
//     });
//   } catch (error: any) {
//     res.status(error.statusCode || 500).json({
//       success: false,
//       message: sanitizeErrorMessage(error) || "Failed to apply for loan foreclose",
//       error: sanitizeErrorMessage(error) || "INTERNAL_SERVER_ERROR",
//     });
//   }


// export const payforecloseLoanController = async (
//   req: Request,
//   res: Response,
// ) => {
//   try {
//     const loanId = getParam(req, "loanId");
//     const { userId, branchId } = requireActor(req);
//     if (!loanId) {
//       throw AppError.badRequest("Loan id is required");
//     }
//     const loan = await ensureLoanBranchAccess(req, loanId);
//     const data = req.body;
//     // Implement foreclose loan logic here
//     const result = await payforecloseLoanService(loan.id, data, userId, branchId);
//     res.status(200).json({
//       success: true,
//       message: "Loan foreclosed successfully",
//       data: result,
//     });
//   } catch (error: any) {
//     res.status(error.statusCode || 500).json({
//       success: false,
//       message: sanitizeErrorMessage(error) || "Failed to foreclose loan",
//       error: sanitizeErrorMessage(error) || "INTERNAL_SERVER_ERROR",
//     });
//   }
// };
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

    const loan = await ensureLoanBranchAccess(req, loanId);

    const result = await applyMoratoriumService({
      loanId: loan.id,
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
      message: sanitizeErrorMessage(error) || "Failed to apply moratorium",
      error: sanitizeErrorMessage(error) || "INTERNAL_SERVER_ERROR",
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
      message: sanitizeErrorMessage(error) || "Failed to update EMI",
      error: sanitizeErrorMessage(error) || "INTERNAL_SERVER_ERROR",
    });
  }
};
