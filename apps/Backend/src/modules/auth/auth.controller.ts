import { Request, Response } from "express";
import { loginService ,logoutService } from "./auth.service.js";
import { cookieOptions, clearCookieOptions } from "../../common/utils/utils.js";
import { AppError } from "../../common/utils/apiError.js";

export const loginController = async (req: Request, res: Response) => {
  try {
    // Accept either `email` or `userName` from the client as identifier
    const { email, userName, password } = req.body as {
      email?: string;
      userName?: string;
      password: string;
    };
    const identifier = email ?? userName;
    if (!identifier)
      return res
        .status(400)
        .json({ success: false, message: "email or userName is required" });

    const { user, accessToken, refreshToken } = await loginService(identifier, password);

    const safeUser = {
      id: user.id,
      fullName: user.fullName,
      userName: user.userName,
      email: user.email,
      role: user.role,
      contactNumber: user.contactNumber,
      branchId: user.branchId,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json({ success: true, message: "Login successful", data: safeUser });
  } catch (error: any) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message = error instanceof AppError ? error.message : "Login failed";
    res.status(statusCode).json({ success: false, message });
  }
};


export const logoutController = async (req: Request, res: Response) => {
  try {
    const result = await logoutService();
    // Clear tokens from cookies
    res
      .status(200)
      .clearCookie("accessToken", clearCookieOptions)
      .clearCookie("refreshToken", clearCookieOptions)
      .json(result);
  } catch (error: any) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message = error instanceof AppError ? error.message : "Logout failed";
    res.status(statusCode).json({ success: false, message });

  }
};