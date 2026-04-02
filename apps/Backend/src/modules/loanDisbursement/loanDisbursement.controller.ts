import { Request, Response } from "express";
import { disburseLoanService } from "./loanDisbursement.service.js";


export const disburseLoanController = async (req: Request, res: Response) => {
 
    try {
        const { id } = req.params;
        const loanId = typeof id === "string" ? id : id[0];
            if (!req.user) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }
            const result = await disburseLoanService(
                loanId,
                req.user.id,
                req.body
            )

            res.status(200).json({
                success: true,
                message: "Loan disbursed successfully",
                data: result,
            });
            
        } catch (error) {
            const statusCode = error instanceof Error && 'statusCode' in error
                ? (error as { statusCode: number }).statusCode
                : 500;
            const message = error instanceof Error ? error.message : "INTERNAL_SERVER_ERROR";
            res.status(statusCode).json({
                success: false,
                message: "Failed to disburse loan",
                error: message,
            });
        }

    }