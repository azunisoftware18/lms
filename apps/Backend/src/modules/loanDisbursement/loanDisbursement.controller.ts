import { Request, Response } from "express";
import {
    disburseLoanService,
    getDisbursementByLoanNumberService,
    listDisbursementsService,
    reverseDisbursementService,
} from "./loanDisbursement.service.js";

export const disburseLoanController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const loanNumber = typeof id === "string" ? id : id[0];
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const result = await disburseLoanService(loanNumber, req.user.id, req.body);

        res.status(200).json({ success: true, message: "Loan disbursed successfully", data: result });
    } catch (error) {
        const statusCode = error instanceof Error && "statusCode" in error ? (error as { statusCode: number }).statusCode : 500;
        const message = error instanceof Error ? error.message : "INTERNAL_SERVER_ERROR";
        res.status(statusCode).json({ success: false, message: message || "Failed to disburse loan", error: message });
    }
};

export const getDisbursementController = async (req: Request, res: Response) => {
    try {
        const { loanNumber: loanNumberParam } = req.params;
        const loanNumber = typeof loanNumberParam === "string" ? loanNumberParam : loanNumberParam[0];
        const data = await getDisbursementByLoanNumberService(loanNumber);
        res.status(200).json({ success: true, data });
    } catch (error) {
        const statusCode = error instanceof Error && "statusCode" in error ? (error as { statusCode: number }).statusCode : 500;
        const message = error instanceof Error ? error.message : "INTERNAL_SERVER_ERROR";
        res.status(statusCode).json({ success: false, message:message|| "Failed to fetch disbursement", error: message });
    }
};

export const listDisbursementsController = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const data = await listDisbursementsService({ page, limit });
        res.status(200).json({ success: true, ...data });
    } catch (error) {
        const statusCode = error instanceof Error && "statusCode" in error ? (error as { statusCode: number }).statusCode : 500;
        const message = error instanceof Error ? error.message : "INTERNAL_SERVER_ERROR";
        res.status(statusCode).json({ success: false, message:message|| "Failed to list disbursements", error: message });
    }
};

export const reverseDisbursementController = async (req: Request, res: Response) => {
    try {
        const { loanNumber: loanNumberParam } = req.params;
        const loanNumber = typeof loanNumberParam === "string" ? loanNumberParam : loanNumberParam[0];
        const reason = req.body?.reason;
        if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
        const data = await reverseDisbursementService(loanNumber, req.user.id, reason);
        res.status(200).json({ success: true, message: "Disbursement reversed", data });
    } catch (error) {
        const statusCode = error instanceof Error && "statusCode" in error ? (error as { statusCode: number }).statusCode : 500;
        const message = error instanceof Error ? error.message : "INTERNAL_SERVER_ERROR";
        res.status(statusCode).json({ success: false, message: message ||"Failed to reverse disbursement", error: message });
    }
};