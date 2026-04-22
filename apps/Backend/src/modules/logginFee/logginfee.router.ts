import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { validate } from "../../common/middlewares/zod.middleware.js";
import {
	createLogginFeeSchema,
	logginFeeIdParamSchema,
	updateLogginFeeStatusSchema,
} from "./logginFee.schema.js";
import {
	chargeLogginFeeController,
	getAllLogginFeesController,
	getLogginFeeByIdController,
	updateLogginFeeStatusController,
} from "./logginFee.controller.js";

const logginFeeRouter = Router();

logginFeeRouter.use(authMiddleware);

logginFeeRouter.post(
	"/charge",
	validate(createLogginFeeSchema),
	chargeLogginFeeController,
);

logginFeeRouter.get(
	"/all",
	getAllLogginFeesController,
);

logginFeeRouter.get(
	"/:id",
	validate(logginFeeIdParamSchema, "params"),
	getLogginFeeByIdController,
);

logginFeeRouter.patch(
	"/:id/status",
	validate(logginFeeIdParamSchema, "params"),
	validate(updateLogginFeeStatusSchema),
	updateLogginFeeStatusController,
);

export default logginFeeRouter;
