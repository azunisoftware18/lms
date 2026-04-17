import { Request, Response } from "express";
import axios from "axios";
import ENV from "../../common/config/env.js";


//Dammy data for Aadhaar API responses. Will be used if AADHAAR_DUMMY env var is set to true or if not in production environment.
const USE_AADHAAR_DUMMY =
  process.env.AADHAAR_DUMMY === "true" || ENV.NODE_ENV !== "production";

const DUMMY_REF_ID = "74770957";

const DUMMY_SEND_RESPONSE = {
  status: true,
  statusCode: 200,
  data: {
    ref_id: DUMMY_REF_ID,
    status: "SUCCESS",
  },
  message: "",
};

const DUMMY_VERIFY_RESPONSE = {
  status: true,
  statusCode: 200,
  data: {
    ref_id: "74770957",
    status: "VALID",
    care_of: "PARVEZ AHMAD KHAN",
    address:
      "PLOT NO 24, NEAR TAJ MEDICAL STORE, MADINA COLONY, Jhotwara, Jaipur, Jhotwara, Rajasthan, India, 302012",
    dob: "09-02-2003",
    email: "",
    gender: "M",
    name: "Faiz Khan",
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
    photo_link:
      "data:image/png;base64,data:image/png;base64,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",
    share_code: "2345",
    xml_file: "",
  },
  message: "",
};


//Dammy end 
function handleAxiosError(res: Response, error: unknown) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 502;
    const data = error.response?.data ?? { message: error.message };
    console.error("Aadhaar API error:", data);
    return res.status(status).json({ success: false, error: data });
  }
  console.error("Unexpected error:", error);
  //dammy 
  return res
    .status(500)
    .json({ success: false, error: (error as Error).message || "Internal error" });
    //dammy end
}

export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { aadhaarNumber } = req.body;
    if (!aadhaarNumber || !/^\d{12}$/.test(String(aadhaarNumber))) {
      //dammy 
      return res
        .status(400)
        .json({ success: false, message: "Invalid aadhaarNumber. Expected 12 digits." });
        //dammy end
    }
//dammy
    if (USE_AADHAAR_DUMMY) {
      return res.status(200).json(DUMMY_SEND_RESPONSE);
    }

    const response = await axios.post(
      `${ENV.VERIFICATION_BASE_URL}/send-otp`,
      { aadhaar: aadhaarNumber },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ENV.VERIFICATION_API_KEY}`,
        },
      },
    );
    const providerResult = response.data;

    if (
      providerResult?.apiStatus === false ||
      providerResult?.status === false ||
      Number(providerResult?.statusCode ?? 200) >= 400
    ) {
      
      return res.status(Number(providerResult?.statusCode ?? 502)).json({
        success: false,
        message: providerResult?.message || "Aadhaar OTP send failed",
        error: providerResult,
      });
    }

    console.log("Aadhaar OTP sent successfully for", providerResult);
    return res.status(200).json(providerResult);
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
      return res.status(200).json(DUMMY_VERIFY_RESPONSE);
    }

    const response = await axios.post(
      `${ENV.VERIFICATION_BASE_URL}/verifyAadhar`,
      { ref_id, otp },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ENV.VERIFICATION_API_KEY}`,
        },
      },
    );
    const providerResult = response.data;

    if (
      providerResult?.apiStatus === false ||
      providerResult?.status === false ||
      Number(providerResult?.statusCode ?? 200) >= 400
    ) {
      return res.status(Number(providerResult?.statusCode ?? 502)).json({
        success: false,
        message: providerResult?.message || "Aadhaar OTP verification failed",
        error: providerResult,
      });
    }

    console.log("Aadhaar OTP verification successful for", providerResult);
    return res.status(200).json(providerResult);
  } catch (error) {
    return handleAxiosError(res, error);
  }
};
