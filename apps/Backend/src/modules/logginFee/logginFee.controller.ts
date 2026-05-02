import { Request, Response } from "express";
import {
	createLogginFeeService,
	getLogginFeeByIdService,
	listLogginFeeService,
	payLogginFeeService,
} from "./logginFee.service.js";
import { LoginFeeStatus } from "./logginFee.types.js";

const getSafeError = (error: any, fallback: string) => {
	if (error?.message) return error.message;
	return fallback;
};

const getParamAsString = (value: unknown) => {
	if (Array.isArray(value)) return value[0] || "";
	return typeof value === "string" ? value : "";
};

const getUserContext = (req: Request) => {
	const userId = req.user?.id;
	const branchId = req.user?.branchId;

	if (!userId || !branchId) {
		return null;
	}

	return { userId, branchId };
};

export const chargeLogginFeeController = async (req: Request, res: Response) => {
	try {
		const userContext = getUserContext(req);
		if (!userContext) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized",
			});
		}

		const data = await createLogginFeeService(
			req.body,
			userContext.userId,
			userContext.branchId,
		);

		return res.status(201).json({
			success: true,
			message: "Login fee charged successfully",
			data,
		});
	} catch (error: any) {
		return res.status(error?.statusCode || 500).json({
			success: false,
			message: getSafeError(error, "Failed to charge login fee"),
		});
	}
};

export const getAllLogginFeesController = async (
	req: Request,
	res: Response,
) => {
	try {
		const data = await listLogginFeeService({
			page: Number(req.query.page),
			limit: Number(req.query.limit),
			q: req.query.q?.toString(),
			status: req.query.status?.toString() as LoginFeeStatus,
			paymentMode: req.query.paymentMode?.toString() as any,
			institutionType: req.query.institutionType?.toString() as any,
			dateFrom: req.query.dateFrom?.toString(),
			dateTo: req.query.dateTo?.toString(),
		});

		return res.status(200).json({
			success: true,
			message: "Login fees retrieved successfully",
			data,
		});
	} catch (error: any) {
		return res.status(error?.statusCode || 500).json({
			success: false,
			message: getSafeError(error, "Failed to retrieve login fees"),
		});
	}
};

export const getLogginFeeByIdController = async (req: Request, res: Response) => {
	try {
		const id = getParamAsString(req.params.id);
		const data = await getLogginFeeByIdService(id);

		return res.status(200).json({
			success: true,
			message: "Login fee details retrieved successfully",
			data,
		});
	} catch (error: any) {
		return res.status(error?.statusCode || 500).json({
			success: false,
			message: getSafeError(error, "Failed to retrieve login fee"),
		});
	}
};

export const payLogginFeeController = async (req: Request, res: Response) => {
	try {
		const userContext = getUserContext(req);
		if (!userContext) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized",
			});
		}
		const id = req.params.id;
		const recordId = getParamAsString(id);
		const data = await payLogginFeeService(
			recordId,
			userContext.userId,
			userContext.branchId,
		);
		return res.status(200).json({
			success: true,
			message: "Login fee marked as PAID successfully",
			data,

		});
	} catch (error: any) {

		return res.status(error?.statusCode || 500).json({
			success: false,
			message: getSafeError(error, "Failed to mark login fee as PAID"),
		});
	}

};