import { Router } from "express";
import { loginController ,logoutController } from "./auth.controller.js";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";

export const authRouter = Router();

// Public route
authRouter.post("/login", loginController);

// Protected route example (you can add more protected routes as needed)
authRouter.post("/logout", authMiddleware, logoutController);


export default authRouter;
