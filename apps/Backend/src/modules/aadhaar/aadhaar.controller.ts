import { Request, Response } from "express";
import axios from "axios";
import ENV from "../../common/config/env.js";

// Configuration from environment
const AADHAAR_API_BASE_URL = ENV.AADHAAR_API;
const AADHAAR_API_KEY = ENV.AADHAAR_API_KEY ;

if (!AADHAAR_API_KEY) {
  console.warn("Warning: AADHAAR_API_KEY is not set. Requests to Aadhaar API will be unauthenticated.");
}

// Shared axios instance with sensible defaults for production
const http = axios.create({
  baseURL: AADHAAR_API_BASE_URL,
  timeout: 10_000, // 10s
  headers: {
    "Content-Type": "application/json",
    ...(AADHAAR_API_KEY ? { Authorization: `Bearer ${AADHAAR_API_KEY}` } : {}),
  },
});

function handleAxiosError(res: Response, error: unknown) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 502;
    const data = error.response?.data ?? { message: error.message };
    console.error("Aadhaar API error:", data);
    return res.status(status).json({ success: false, error: data });
  }
  console.error("Unexpected error:", error);
  return res.status(500).json({ success: false, error: (error as Error).message || "Internal error" });
}


export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { aadhaarNumber } = req.body;
    if (!aadhaarNumber || !/^\d{12}$/.test(String(aadhaarNumber))) {
      return res.status(400).json({ success: false, message: "Invalid aadhaarNumber. Expected 12 digits." });
    }

    const response = await http.post("/send-otp", { aadhaarNumber });
    return res.json({ success: true, data: response.data });
  } catch (error) {
    return handleAxiosError(res, error);
  }
};

/**
 * Verify OTP for Aadhaar.
 * Expects { aadhaarNumber: string, otp: string } in body.
 */
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { aadhaarNumber, otp } = req.body;
    if (!aadhaarNumber || !/^\d{12}$/.test(String(aadhaarNumber))) {
      return res.status(400).json({ success: false, message: "Invalid aadhaarNumber. Expected 12 digits." });
    }
    if (!otp || !/^\d{4,6}$/.test(String(otp))) {
      return res.status(400).json({ success: false, message: "Invalid otp. Expected 4-6 digits." });
    }

    const response = await http.post("/verify-otp", { aadhaarNumber, otp });
     return response 
  } catch (error) {
    return handleAxiosError(res, error);
  }
};



