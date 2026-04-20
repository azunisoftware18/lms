import { Request, Response } from "express";
import axios from "axios";
import ENV from "../../common/config/env.js";

const isValidHttpUrl = (value: unknown) => {
  if (typeof value !== "string" || !value.trim()) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

// Dummy/dev mode for PAN verification
const USE_PAN_DUMMY =
  String((ENV as any).PAN_DUMMY ?? process.env.PAN_DUMMY ?? "").toLowerCase() ===
    "true" ||
  String((ENV as any).AADHAAR_DUMMY ?? process.env.AADHAAR_DUMMY ?? "").toLowerCase() ===
    "true";

const DUMMY_PAN_VERIFY_RESPONSE = {
  status: true,
  statusCode: 200,
  data: {
    pan: "ABCDE1234F",
    type: "Individual",
    registered_name: "RAHUL SHARMA",
    valid: true,
    message: "PAN verified successfully",
    aadhaar_seeding_status: "Y",
    last_updated_at: "12/03/2020",
    name_pan_card: "RAHUL KUMAR SHARMA",
    pan_status: "VALID",
    aadhaar_seeding_status_desc: "Aadhaar is linked to PAN"
  },
  message: ""
};

const DUMMY_PAN_VERIFY_RESPONSE_MASKED = {
  status: true,
  statusCode: 200,
  data: {
    pan: "HHXXX6134L",
    type: "Individual",
    registered_name: "SATHYAXXXXXXXX",
    valid: true,
    message: "PAN verified successfully",
    aadhaar_seeding_status: "Y",
    last_updated_at: "27/XX/2012",
    name_pan_card: "XXXXXXXX  SATHYAXXXXXXX",
    pan_status: "VALID",
    aadhaar_seeding_status_desc: "Aadhaar is linked to PAN",
  },
  message: "",
};

const buildDummyPanResponse = (normalizedPan: string) => {
  if (normalizedPan === "HHXXX6134L") {
    return {
      ...DUMMY_PAN_VERIFY_RESPONSE_MASKED,
      data: {
        ...DUMMY_PAN_VERIFY_RESPONSE_MASKED.data,
        pan: normalizedPan,
      },
    };
  }

  return {
    ...DUMMY_PAN_VERIFY_RESPONSE,
    data: {
      ...DUMMY_PAN_VERIFY_RESPONSE.data,
      pan: normalizedPan,
    },
  };
};




function handleAxiosError(res: Response, error: unknown) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 502;
    const data = error.response?.data ?? { message: error.message };
    console.error("PAN API error:", data);
    return res.status(status).json({ success: false, error: data });
  }
  console.error("Unexpected error:", error);
  return res.status(500).json({ success: false, error: (error as Error).message || "Internal error" });
}


export const verifyPan = async (req: Request, res: Response) => {
  try {
    const { panNumber } = req.body;
    const normalizedPan = String(panNumber || "").trim().toUpperCase();
    if (!normalizedPan || !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(normalizedPan)) {
      return res.status(400).json({ success: false, message: "Invalid panNumber. Expected PAN format like ABCDE1234F." });
    }

    if (USE_PAN_DUMMY || !isValidHttpUrl(ENV.VERIFICATION_BASE_URL)) {
      return res.status(200).json({ success: true, data: buildDummyPanResponse(normalizedPan) });
    }

    if (!ENV.VERIFICATION_API_KEY) {
      return res.status(500).json({
        success: false,
        message:
          "PAN verification is not configured. Set VERIFICATION_BASE_URL and VERIFICATION_API_KEY.",
      });
    }


    const response = await axios.post(`${ENV.VERIFICATION_BASE_URL}/verifyPanLite`, { pan: normalizedPan },{
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
        message: providerResult?.message || "PAN verification failed",
        error: providerResult,
      });
    }

    console.log("PAN verification successful for", providerResult);
    return res.status(200).json({ success: true, data: providerResult });

  } catch (error) {

    
    return handleAxiosError(res, error);
  }
};




