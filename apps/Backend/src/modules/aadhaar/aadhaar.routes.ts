import { Router } from "express";
import { sendOtp, verifyOtp } from "./aadhaar.controller.js";



const aadhaarRouter = Router();


aadhaarRouter.post("/send-otp", sendOtp);
aadhaarRouter.post("/verify-otp", verifyOtp);

export default aadhaarRouter;