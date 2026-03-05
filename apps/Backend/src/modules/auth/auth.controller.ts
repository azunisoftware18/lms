import { Request, Response } from "express";
import { loginService ,logoutService } from "./auth.service.js";
import { cookieOptions, clearCookieOptions } from "../../common/utils/utils.js";

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

    const { user, accessToken, refreshToken } = await loginService(
      identifier,
      password
    );

    const { password: _pw, ...safeUser } = user as any;
    res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json({ success: true, message: "Login successful", data: safeUser });
  } catch (error: any) {
    if (error.message && error.message.includes("Invalid credentials")) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    res.status(400).json({ success: false, message: "Login failed", error: error.message  });
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
    res.status(400).json({ success: false, message: "Logout failed", error: error.message });
    

  }
};