import { Request, Response } from "express";

import {
  createTechnicalReportService,
  approveTechnicalReportService,
  getAllTechnicalReportsService,
} from "./technical.service.js";
import logger from "../../../common/logger.js";
import { createTechnicalReportSchema } from "./technical.schema.js";

export const createTechnicalReportController = async (
  req: Request,
  res: Response
) => {
  try {
    const { loanNumber } = req.params;

    // ✅ Validate request body
    const validatedData = createTechnicalReportSchema.parse(req.body);

    const report = await createTechnicalReportService(
      loanNumber,
      validatedData,
      req.user!.id
    );

    return res.status(201).json({
      success: true,
      message: "Technical report created successfully",
      data: report,
    });
  } catch (error: any) {
    logger.error("createTechnicalReport error: %o", error);

    // ✅ Zod validation error
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
      });
    }

    // ✅ Custom errors
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    // ✅ Fallback
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const approveTechnicalReportController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { reportId } = req.params;

    const report = await approveTechnicalReportService(reportId, req.user!.id);

    res.json({
      success: true,
      message: "Technical report approved successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to approve technical report",
      error: error.message || "INTERNAL_SERVER_ERROR",
    });
  }
};

export const getAllTechnicalReportsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const reports = await getAllTechnicalReportsService({
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      q: req.query.q?.toString(),
    }, {
      id: req.user!.id,
      role: (req.user as any).role,
      branchId: (req.user as any).branchId,
    });
    res.status(200).json({
      success: true,
      message: "Technical reports retrieved successfully",
      data: reports.data,
      meta: reports.meta,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve technical reports",
      error: error.message || "INTERNAL_SERVER_ERROR",
    });
  }
};
