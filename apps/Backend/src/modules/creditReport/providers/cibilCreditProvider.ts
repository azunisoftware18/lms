import axios from "axios";
import logger from "../../../common/logger.js";
import ENV from "../../../common/config/env.js";
import { prisma } from "../../../db/prismaService.js";


const CIBIL_API_URL = ENV.CIBIL_API || "https://api.bulkpe.in/client/getCibil";
const CIBIL_API_KEY = ENV.CIBIL_API_KEY || "";

if (!CIBIL_API_KEY) {
  logger.warn("CIBIL_API_KEY is not set. Requests to CIBIL API may fail.");
}

const cibilClient = axios.create({
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    ...(CIBIL_API_KEY ? { Authorization: `Bearer ${CIBIL_API_KEY}` } : {}),
  },
});


function handleAxiosError(res: Response, error: unknown) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 502;
    const data = error.response?.data ?? { message: error.message };
    logger.error("CIBIL API error:", data);
    return res.status(status).json({ success: false, error: data });
  }
  logger.error("Unexpected error:", error);
  return res.status(500).json({ success: false, error: (error as Error).message || "Internal error" });
}


export const cibilCreditProvider = async (req: Request, res: Response) => {
  try {
   const {firstName,lastName,phone,pan} = req.body;

    if (!pan || !firstName || !lastName || !phone) {
      return res.status(400).json({ success: false, message: "Missing required fields: pan, firstName, lastName, phone" });
    }
    const response = await cibilClient.post(CIBIL_API_URL, {
      pan,
      firstName,
      lastName,
      phone
    });
    return response.data;
  } catch (error) {
    return handleAxiosError(res, error);
  }
}
