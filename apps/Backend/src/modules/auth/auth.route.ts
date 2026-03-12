import { Router } from "express";
import { loginController ,logoutController } from "./auth.controller.js";
import { authMiddleware } from "../../common/middlewares/auth.middleware.js";
import { createRateLimiter } from "../../common/middlewares/rateLimit.middleware.js";
import { loginValidation, validateAuthRequest } from "./auth.validation.js";
import { rateLimit } from "../../common/middlewares/rateLimit.middleware.js";

export const authRouter = Router();

const loginLimiter = createRateLimiter({
	windowMs: Number(process.env.LOGIN_RATE_LIMIT_WINDOW_MS || 10 * 60 * 1000),
	max: Number(process.env.LOGIN_RATE_LIMIT_MAX || 10),
	message: "Too many login attempts. Please try again later.",
	keyScope: "ip",
});

// Public route
authRouter.post("/login", loginLimiter, loginValidation, validateAuthRequest, loginController);

// Protected route example (you can add more protected routes as needed)
authRouter.post("/logout", authMiddleware, logoutController);

// Then use it as:
// authRouter.use(rateLimit(10, 60_000));

export default authRouter;
