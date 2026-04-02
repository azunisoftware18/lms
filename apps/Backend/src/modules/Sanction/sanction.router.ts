import { Router } from "express";
import {
	createSanctionController,
	listSanctionsController,
	getSanctionByIdController,
	updateSanctionController,
	deleteSanctionController,
} from "./sanction.controller.js";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { checkPermissionMiddleware } from "../../common/middlewares/permission.middleware.js";
import { validate } from "../../common/middlewares/zod.middleware.js";
import { createSanctionSchema, updateSanctionSchema, sanctionIdParamSchema, sanctionListQuerySchema } from "./sanction.schema.js";

const sanctionRouter = Router();

sanctionRouter.post(
	"/",
	authMiddleware,
	checkPermissionMiddleware("CREATE_SANCTION"),
	validate(createSanctionSchema),
	createSanctionController,
);

sanctionRouter.get(
	"/",
	authMiddleware,
	checkPermissionMiddleware("VIEW_SANCTION"),
	listSanctionsController,
);

sanctionRouter.get(
	"/:id",
	authMiddleware,
	checkPermissionMiddleware("VIEW_SANCTION"),
	validate(sanctionIdParamSchema, "params"),
	getSanctionByIdController,
);

sanctionRouter.patch(
	"/:id",
	authMiddleware,
	checkPermissionMiddleware("UPDATE_SANCTION"),
	validate(sanctionIdParamSchema, "params"),
	validate(updateSanctionSchema),
	updateSanctionController,
);

sanctionRouter.delete(
	"/:id",
	authMiddleware,
	checkPermissionMiddleware("DELETE_SANCTION"),
	validate(sanctionIdParamSchema, "params"),
	deleteSanctionController,
);

export default sanctionRouter;
