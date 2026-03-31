import { Request, Response } from "express";
import {
  assignLeadService,
  convertLeadToLoanApplicationService,
  createLeadService,
  getAllLeadsService,
  getLeadByIdService,
  updateLeadStatusService,
} from "./lead.service.js";

const toPublicLead = (lead: any) => {
  if (!lead) return lead;

  const addressLine =
    typeof lead.address === "string"
      ? lead.address
      : lead.address?.addressLine1 || null;
  const city = lead.city ?? lead.address?.city ?? null;
  const state = lead.state ?? lead.address?.state ?? null;
  const pinCode = lead.pinCode ?? lead.address?.pinCode ?? null;

  return {
    id: lead.id,
    fullName: lead.fullName,
    contactNumber: lead.contactNumber,
    email: lead.email,
    leadNumber: lead.leadNumber,
    dob: lead.dob,
    gender: lead.gender,
    loanAmount: lead.loanAmount,
    status: lead.status,
    assignedTo: lead.assignedTo,
    assignedBy: lead.assignedBy,
    convertedLoanApplicationId: lead.convertedLoanApplicationId,
    loanType: lead.loanType
      ? {
          id: lead.loanType.id,
          name: lead.loanType.name,
          isActive: lead.loanType.isActive,
        }
      : null,
    address: addressLine,
    city,
    state,
    pinCode,
    assignedToUser: lead.assignedToUser
      ? {
          id: lead.assignedToUser.id,
          email: lead.assignedToUser.email,
          role: lead.assignedToUser.role,
        }
      : null,
    assignedByUser: lead.assignedByUser
      ? {
          id: lead.assignedByUser.id,
          email: lead.assignedByUser.email,
          role: lead.assignedByUser.role,
        }
      : null,
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
  };
};

const toPublicLoan = (loan: any) => {
  if (!loan) return loan;
  return {
    id: loan.id,
    loanNumber: loan.loanNumber,
    status: loan.status,
    customerId: loan.customerId,
    leadId: loan.leadId,
    loanTypeId: loan.loanTypeId,
    requestedAmount: loan.requestedAmount,
    approvedAmount: loan.approvedAmount,
    branchId: loan.branchId,
    applicationDate: loan.applicationDate,
    createdAt: loan.createdAt,
    updatedAt: loan.updatedAt,
  };
};

const getSafeErrorMessage = (error: any, fallback: string) => {
  if (error?.statusCode && error.statusCode < 500) {
    return error.message || fallback;
  }
  return fallback;
};

const getParamAsString = (value: unknown) => {
  if (Array.isArray(value)) return value[0] || "";
  return typeof value === "string" ? value : "";
};

export const createLeadController = async (req: Request, res: Response) => {
  try {
    const lead = await createLeadService(req.body);

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: toPublicLead(lead),
    });
  } catch (error: any) {
    // Prisma unique constraint
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Duplicate lead detected",
        error: error.meta?.target,
      });
    }

    res.status(error.statusCode || 500).json({
      success: false,
      message: getSafeErrorMessage(error, "Lead creation failed"),
    });
  }
};

export const getAllLeadsController = async (req: Request, res: Response) => {
  try {
    const leads = await getAllLeadsService({
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      q: req.query.q?.toString(),
      status: req.query.status?.toString(),
    });

    const sanitizedLeads = {
      data: Array.isArray(leads?.data) ? leads.data.map(toPublicLead) : [],
      meta: leads?.meta,
    };

    res.status(200).json({
      success: true,
      message: "Leads retrieved successfully",
      data: sanitizedLeads,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve leads",
    });
  }
};

export const getLeadByIdController = async (req: Request, res: Response) => {
  try {
    const id = getParamAsString(req.params.id);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID provided",
      });
    }
    const lead = await getLeadByIdService(id);
    res.status(200).json({
      success: true,
      message: "Lead retrieved successfully",
      data: toPublicLead(lead),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve lead",
    });
  }
};
export const updateLeadStatusController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = getParamAsString(req.params.id);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID provided",
      });
    }
    const { status } = req.body;
    const updatedLead = await updateLeadStatusService(id, status);
    res.status(200).json({
      success: true,
      message: "Lead status updated successfully",
      data: toPublicLead(updatedLead),
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to update lead status",
    });
  }
};
export const assignLeadController = async (req: Request, res: Response) => {
  try {
    const id = getParamAsString(req.params.id);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID provided",
      });
    }
    const { assignedTo } = req.body;

    // assignedBy comes from authenticated user injected into req.user
    const assignedBy = req.user?.id;
    if (!assignedBy) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const lead = await assignLeadService(id, assignedTo, assignedBy);

    res.status(200).json({
      success: true,
      message: "Lead assigned successfully",
      data: toPublicLead(lead),
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Lead assignment failed",
    });
  }
};

export const convertLeadToLoanController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = getParamAsString(req.params.id);

    if (!id || typeof id !== "string" || id.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID provided",
      });
    }
    const loan = await convertLeadToLoanApplicationService(id);

    res.status(200).json({
      success: true,
      message: "Lead converted to loan application successfully",
      data: toPublicLoan(loan),
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: getSafeErrorMessage(error, "Conversion failed"),
    });
  }
};