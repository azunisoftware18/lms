import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/apiError.js";

type UserRole = "ADMIN" | "EMPLOYEE" | "PARTNER";

const roleMiddleware = (allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw AppError.unauthorized("Unauthorized: User not authenticated.");
        }
       if (
         !req.user.role ||
         !allowedRoles.includes(req.user.role.toUpperCase() as UserRole)
       ) {
         throw AppError.forbidden("Access denied: Insufficient permissions.");
       }

        next();
    };
};

export default roleMiddleware;