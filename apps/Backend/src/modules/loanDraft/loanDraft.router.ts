import { Router } from "express";
import {
	createDraftController,
	getDraftController,
	submitDraftController,
	updateDraftController,
} from "./loanDraft.controller.js";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, createDraftController);

router.patch("/:id", authMiddleware, updateDraftController);

router.get("/:id", authMiddleware, getDraftController);

router.post("/:id/submit", authMiddleware, submitDraftController);

export default router;