import { NextFunction, Request, Response } from "express";
import {
	createSanctionService,
	getSanctionByIdService,
	listSanctionsService,
	updateSanctionService,
	deleteSanctionService,
} from "./sanction.service.js";
import { AppError } from "../../common/utils/apiError.js";
import { sanctionListQuerySchema } from "./sanction.schema.js";

export const createSanctionController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!req.user) throw AppError.unauthorized("Unauthorized");

		const input = req.body;
		const sanction = await createSanctionService(input, { id: req.user.id, role: req.user.role, branchId: req.user.branchId });

		return res.status(201).json({ success: true, message: "Sanction created", data: sanction });
	} catch (error) {
		next(error);
	}
};

export const listSanctionsController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!req.user) throw AppError.unauthorized("Unauthorized");

		const parsed = sanctionListQuerySchema.parse(req.query);
		const result = await listSanctionsService({ id: req.user.id, role: req.user.role, branchId: req.user.branchId }, parsed as any);

		return res.status(200).json({ success: true, message: "Sanctions fetched", data: result.data, meta: result.meta });
	} catch (error) {
		next(error);
	}
};

export const getSanctionByIdController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!req.user) throw AppError.unauthorized("Unauthorized");

		const id = typeof req.params.id === "string" ? req.params.id : req.params.id[0];
		const sanction = await getSanctionByIdService(id, { id: req.user.id, role: req.user.role, branchId: req.user.branchId });

		return res.status(200).json({ success: true, message: "Sanction fetched", data: sanction });
	} catch (error) {
		next(error);
	}
};

export const updateSanctionController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!req.user) throw AppError.unauthorized("Unauthorized");

		const id = typeof req.params.id === "string" ? req.params.id : req.params.id[0];
		const updated = await updateSanctionService(id, req.body, { id: req.user.id, role: req.user.role, branchId: req.user.branchId });

		return res.status(200).json({ success: true, message: "Sanction updated", data: updated });
	} catch (error) {
		next(error);
	}
};

export const deleteSanctionController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!req.user) throw AppError.unauthorized("Unauthorized");

		const id = typeof req.params.id === "string" ? req.params.id : req.params.id[0];
		const deleted = await deleteSanctionService(id, { id: req.user.id, role: req.user.role, branchId: req.user.branchId });

		return res.status(200).json({ success: true, message: "Sanction deleted", data: deleted });
	} catch (error) {
		next(error);
	}
};
