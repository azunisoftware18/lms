import { Request, Response } from "express";
import axios from "axios";
import { apiClient } from "../../common/config/axiosInstance.js";
import ENV from "../../common/config/env.js";




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

   

    const response = await axios.post(`${ENV.VERIFICATION_BASE_URL}/verifyAadhar`, { aadhaar: aadhaarNumber },{
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.VERIFICATION_API_KEY}`,
      },
    });
    const providerResult = response.data;

    // Check for provider failure even on HTTP 200
    if (providerResult?.apiStatus === false || Number(providerResult?.statusCode ?? 200) >= 400) {
      return res.status(Number(providerResult?.statusCode ?? 502)).json({
        success: false,
        message: providerResult?.message || "Aadhaar OTP send failed",
        error: providerResult,
      });
    }

    console.log("Aadhaar OTP sent successfully for", providerResult);
    return res.status(200).json({ success: true, data: providerResult });

  } catch (error) {

    
    return handleAxiosError(res, error);
  }
};

/**
 * Verify OTP for Aadhaar.
 * Expects { ref_id: string, otp: string } in body.
 */
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { ref_id, otp } = req.body;
      
      console.log("Received OTP verification request with ref_id:", ref_id, "and otp:", otp);
    if (!ref_id || !String(ref_id).trim()) {
      return res.status(400).json({ success: false, message: "Invalid ref_id. It is required." });
    }
    if (!otp || !/^\d{4,6}$/.test(String(otp))) {
      return res.status(400).json({ success: false, message: "Invalid otp. Expected 4-6 digits." });
    }

  

    const response = await axios.post(`${ENV.VERIFICATION_BASE_URL}/verifyAadharOtp`, { ref_id, otp }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.VERIFICATION_API_KEY}`,
      },
    });
    const providerResult = response.data;

    if (providerResult?.apiStatus === false || Number(providerResult?.statusCode ?? 200) >= 400) {
      return res.status(Number(providerResult?.statusCode ?? 502)).json({
        success: false,
        message: providerResult?.message || "Aadhaar OTP verification failed",
        error: providerResult,
      });
    }

    console.log("Aadhaar OTP verification successful for", providerResult);
    return res.status(200).json({ success: true, data: providerResult });
  } catch (error) {

    return handleAxiosError(res, error);
  }
};



