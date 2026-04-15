import { Request, Response } from "express";
import axios from "axios";
import ENV from "../../common/config/env.js";

// Configuration from environment
const AADHAAR_API_BASE_URL = ENV.AADHAAR_API;
const AADHAAR_API_KEY = ENV.AADHAAR_API_KEY ;

//Dammy data
  const AADHAAR_MOCK_OTP = "123456";
  const AADHAAR_MOCK_TTL_MS = 10 * 60 * 1000;
  const otpStore = new Map<string, { otp: string; expiresAt: number }>();

  const isMockModeEnabled = () => {
    return (
      ENV.NODE_ENV !== "production" &&
      (!AADHAAR_API_BASE_URL || process.env.AADHAAR_MOCK === "true")
    );
  };
//dammy data end

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

    //Dammy data
    if (isMockModeEnabled()) {
      const normalizedAadhaar = String(aadhaarNumber);
      otpStore.set(normalizedAadhaar, {
        otp: AADHAAR_MOCK_OTP,
        expiresAt: Date.now() + AADHAAR_MOCK_TTL_MS,
      });

      return res.json({
        success: true,
        data: {
          mock: true,
          sessionId: `mock-${normalizedAadhaar.slice(-4)}-${Date.now()}`,
          expiresInSeconds: Math.floor(AADHAAR_MOCK_TTL_MS / 1000),
          otp: AADHAAR_MOCK_OTP,
          message: "Mock OTP generated for testing",
        },
      });
    }
  //dammy data end

    const response = await http.post("/send-otp", { aadhaarNumber });
    return res.json({ success: true, data: response.data });
  } catch (error) {

    //dammy data
    if (ENV.NODE_ENV !== "production") {
      const { aadhaarNumber } = req.body;
      const normalizedAadhaar = String(aadhaarNumber ?? "");
      if (/^\d{12}$/.test(normalizedAadhaar)) {
        otpStore.set(normalizedAadhaar, {
          otp: AADHAAR_MOCK_OTP,
          expiresAt: Date.now() + AADHAAR_MOCK_TTL_MS,
        });
        return res.json({
          success: true,
          data: {
            mock: true,
            sessionId: `mock-fallback-${normalizedAadhaar.slice(-4)}-${Date.now()}`,
            expiresInSeconds: Math.floor(AADHAAR_MOCK_TTL_MS / 1000),
            otp: AADHAAR_MOCK_OTP,
            message: "Provider unavailable, mock OTP generated for testing",
          },
        });
      }
    }
  //dammy data end
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

  // dammy data
    if (isMockModeEnabled()) {
      const normalizedAadhaar = String(aadhaarNumber);
      const record = otpStore.get(normalizedAadhaar);

      if (!record) {
        return res.status(400).json({
          success: false,
          message: "OTP not found for Aadhaar. Please send OTP first.",
        });
      }

      if (Date.now() > record.expiresAt) {
        otpStore.delete(normalizedAadhaar);
        return res.status(400).json({ success: false, message: "OTP expired. Please resend OTP." });
      }

      if (String(otp) !== record.otp) {
        return res.status(400).json({ success: false, message: "Invalid OTP" });
      }

      otpStore.delete(normalizedAadhaar);
      return res.json({
        success: true,
        data: {
          mock: true,
          verified: true,
          message: "Mock OTP verified successfully",
        },
      });
    }
//dammy data end

    const response = await http.post("/verify-otp", { aadhaarNumber, otp });
    return res.json({ success: true, data: response.data });
  } catch (error) {
//dammy data
    if (ENV.NODE_ENV !== "production") {
      const { aadhaarNumber, otp } = req.body;
      const normalizedAadhaar = String(aadhaarNumber ?? "");
      const record = otpStore.get(normalizedAadhaar);

      if (record && Date.now() <= record.expiresAt && String(otp) === record.otp) {
        otpStore.delete(normalizedAadhaar);
        return res.json({
          success: true,
          data: {
            mock: true,
            verified: true,
            message: "Provider unavailable, mock OTP verified successfully",
          },
        });
      }
    }
//dammy data end

    return handleAxiosError(res, error);
  }
};



