import { Router } from "express";
import { verifyPan } from "./pan.controller.js";

const panRouter = Router();

panRouter.post("/details", verifyPan);

export default panRouter;