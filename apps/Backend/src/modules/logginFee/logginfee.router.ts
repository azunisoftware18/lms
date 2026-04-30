import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { validate } from "../../common/middlewares/zod.middleware.js";
import {
	createLogginFeeSchema,
	logginFeeIdParamSchema,
} from "./logginFee.schema.js";
import {
	chargeLogginFeeController,
	getAllLogginFeesController,
	getLogginFeeByIdController,
	payLogginFeeController,
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

logginFeeRouter.post(
	"/:id/pay",
	validate(logginFeeIdParamSchema, "params"),
	payLogginFeeController,
);


export default logginFeeRouter;
