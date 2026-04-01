import {
    Request,
    Response
} from "express";
import {
  approveLegalReportService,
    createLegalReportService,
  getAllLegalReportsService,
  rejectLegalReportService
} from "./legal.service.js";




export const createLegalReportController = async(
    req: Request,
    res: Response
) => {
    try {
        const { loannumber } = req.params;
        const report = await createLegalReportService(
            loannumber,
            req.body,
            req.user!.id
        );
        res.status(201).json({
            success: true,
            message: "Legal report created successfully",
            data: report,
        });
    }
    catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to create legal report",
            error: error.message || "INTERNAL_SERVER_ERROR",
        });
    }
};


export const approveLegalReportController = async (req: Request, res: Response) => {
    try {
        const { reportId } = req.params;
        const approved = req.user!.id;
        const report = await approveLegalReportService(
          reportId,
          approved,
        );
        res.json({
            success: true,
            message: "Legal report approved successfully",
            data: report,
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to approve legal report",
            error: error.message || "INTERNAL_SERVER_ERROR",
        });


    }
}

export const getAllLegalReportsController = async (req: Request, res: Response) => {
    try {
        const reports = await getAllLegalReportsService({
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
            message: "Legal reports retrieved successfully",
            data: reports.data,
            meta: reports.meta,
        });
    }
    catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve legal reports",
            error: error.message || "INTERNAL_SERVER_ERROR",

        });

    }
}


export const rejectLegalReportController = async (req: Request, res: Response) => {
    try {
        const { reportId } = req.params;
        const rejectedby  = req.user!.id;
        const report = await rejectLegalReportService(
            reportId,
            rejectedby,
        );
        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Legal report not found",
                error: "LEGAL_REPORT_NOT_FOUND",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Legal report rejected successfully",
            data: report,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message:error.message || "Failed to reject legal report",
            error: error.message || "INTERNAL_SERVER_ERROR",
        });
    }
}



