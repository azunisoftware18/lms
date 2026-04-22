import { Request, Response } from "express";
import axios from "axios";
import ENV from "../../common/config/env.js";

// Dummy/dev mode - return canned Aadhaar responses for testing
const USE_AADHAAR_DUMMY = process.env.AADHAAR_DUMMY === "true" || ENV.NODE_ENV !== "production";
const DUMMY_REF_ID = "74770957";
const DUMMY_OTP = "123456";
const DUMMY_SEND_RESPONSE = {
  apiStatus: true,
  statusCode: 200,
  data: { ref_id: DUMMY_REF_ID, status: "SUCCESS", otp: DUMMY_OTP },
  message: "",
};
const DUMMY_VERIFY_RESPONSE = {
  apiStatus: true,
  statusCode: 200,
  data: {
    ref_id: DUMMY_REF_ID,
    status: "VALID",
    care_of: "PARVEZ AHMAD KHAN",
    address:
      "PLOT NO 24, NEAR TAJ MEDICAL STORE, MADINA COLONY, Jhotwara, Jaipur, Jhotwara, Rajasthan, India, 302012",
    dob: "09-02-2003",
    email: "",
    gender: "M",
    name: "ggaiz Khan",
    split_address: {
      country: "India",
      dist: "Jaipur",
      house: "PLOT NO 24",
      landmark: "NEAR TAJ MEDICAL STORE",
      pincode: "302012",
      po: "Jhotwara",
      state: "Rajasthan",
      street: "",
      subdist: "",
      vtc: "Jhotwara",
      locality: "MADINA COLONY",
    },
    year_of_birth: "2003",
    mobile_hash:
      "2967b9b923e420e81569983f50f3c29a9c2109bbb12a09fa59ebc8808a7cf13b",
    photo_link: "",
    share_code: "2345",
    xml_file: "",
  },
  message: "",
};




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

    if (USE_AADHAAR_DUMMY) {
      return res.status(200).json({ success: true, data: DUMMY_SEND_RESPONSE });
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

    
    if (USE_AADHAAR_DUMMY) {
      // For dummy mode, accept any otp and return the canned verify payload
      return res.status(200).json({ success: true, data: DUMMY_VERIFY_RESPONSE });
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



