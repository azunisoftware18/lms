import { Router } from "express";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { branchMiddleware } from "../../common/middlewares/branch.middleware.js";
import { generateNOCPDFController } from "./loanclose.controller.js";

const router = Router();

// Download NOC PDF for a closed loan
router.get(
  "/loans/:loanAccountNumber/noc",
  authMiddleware,
  branchMiddleware,
  generateNOCPDFController,
);

export default router;
