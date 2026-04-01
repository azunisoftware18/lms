import { Router } from "express";
import {
    createTechnicalReportController,
    approveTechnicalReportController,
    getAllTechnicalReportsController,
    editTechnicalReportController,
    rejectTechnicalReportController
} from "./technical.controller.js";
import { checkPermissionMiddleware } from "../../../common/middlewares/permission.middleware.js";

import { authMiddleware } from "../../../common/middlewares/auth.middleware.js";


const technicalReportRouter = Router();

technicalReportRouter.post(
  "/loan-applications/:loanNumber/technical-reports",
  authMiddleware,
  checkPermissionMiddleware("CREATE_TECHNICAL_REPORT"),
  createTechnicalReportController
);

technicalReportRouter.post(
    "/technical-reports/:reportId/approve",
    authMiddleware,
    checkPermissionMiddleware("APPROVE_TECHNICAL_REPORT"),
    approveTechnicalReportController,
)

technicalReportRouter.get(
    "/technical-reports",
    authMiddleware,
    checkPermissionMiddleware("VIEW_TECHNICAL_REPORTS"),
    getAllTechnicalReportsController,
)
technicalReportRouter.put(
    "/technical-reports/:reportId",
    authMiddleware,
    checkPermissionMiddleware("EDIT_TECHNICAL_REPORT"),
    editTechnicalReportController, // Reusing the same controller for update
)
technicalReportRouter.patch(
    "/technical-reports/:reportId/reject",
    authMiddleware,
    checkPermissionMiddleware("REJECT_TECHNICAL_REPORT"),
    rejectTechnicalReportController, // Reusing the same controller for update
)


export default technicalReportRouter;