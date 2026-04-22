import { Router } from "express";
import {
  createEmployeeController,
  getAllEmployeesController,
  getEmployeeByIdController,
  updateEmployeeController,
  getEmployeeDashBoardController,
} from "./employee.controller.js";
import { validate } from "../../common/middlewares/zod.middleware.js";
import {createEmployeeSchema, updateEmployeeSchema, employeeIdParamSchema
} from "./employee.schema.js";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { checkPermissionMiddleware } from "../../common/middlewares/permission.middleware.js";
import { createRateLimiter } from "../../common/middlewares/rateLimit.middleware.js";
import upload from "../../common/middlewares/multer.middleware.js";
import { cleanupFiles } from "../../common/utils/cleanup.js";

export const employeeRouter = Router();

const employeeWriteLimiter = createRateLimiter({
  windowMs: 60_000,
  max: 20,
  message: "Too many employee write requests. Please try again later.",
  keyScope: "user",
});

const validateEmployeeMultipartBody =
  (schema: typeof createEmployeeSchema | typeof updateEmployeeSchema) =>
  (req: any, res: any, next: any) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      if (req.files && req.files instanceof Array) {
        cleanupFiles(req.files);
      }

      const response: any = {
        success: false,
        message: "Invalid request data",
      };

      if (process.env.NODE_ENV !== "production") {
        response.errors = result.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        }));
      }

      return res.status(400).json(response);
    }

    req.body = result.data;
    next();
  };

// Protect all routes defined after this middleware
employeeRouter.use(authMiddleware);
employeeRouter.post(
  "/",
  employeeWriteLimiter,
  checkPermissionMiddleware("CREATE_EMPLOYEE"),
  upload.any(),
  validateEmployeeMultipartBody(createEmployeeSchema),
  createEmployeeController
);



employeeRouter.get("/all",
  checkPermissionMiddleware("VIEW_ALL_EMPLOYEES"),
  getAllEmployeesController);




employeeRouter.get(
  "/dashboard",
  checkPermissionMiddleware("VIEW_EMPLOYEE_DETAILS"),
  getEmployeeDashBoardController,
);

employeeRouter.patch(
  "/:id",
  employeeWriteLimiter,
  validate(employeeIdParamSchema, "params"),
  checkPermissionMiddleware("UPDATE_EMPLOYEE"),
  upload.any(),
  validateEmployeeMultipartBody(updateEmployeeSchema),
  updateEmployeeController
);


employeeRouter.get("/:id",
  validate(employeeIdParamSchema, "params"),
  checkPermissionMiddleware("VIEW_EMPLOYEE_DETAILS"),
  getEmployeeByIdController);




export default employeeRouter;
