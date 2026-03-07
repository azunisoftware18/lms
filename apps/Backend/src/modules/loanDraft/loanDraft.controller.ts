import { Request, Response } from "express";
import {
  createLoanDraftService,
  getLoanDraftByIdService,
  submitLoanDraftService,
  updateLoanDraftService,
} from "./loanDraft.service.js";
import * as Enums from "../../../generated/prisma-client/enums.js";

const getRouteId = (id: string | string[] | undefined): string => {
  if (typeof id === "string") return id;
  if (Array.isArray(id)) return id[0] ?? "";
  return "";
};

export const createDraftController = async (req:Request, res:Response) => {
  if (!req.user?.id || !req.user?.branchId) {
    throw new Error("Unauthorized user context");
  }

  const draft = await createLoanDraftService(
    req.user.id,
    req.user.branchId
  );

  res.json({
    success: true,
    data: draft
  });
};

export const updateDraftController = async (req:Request, res:Response) => {
  const draftId = getRouteId(req.params.id);

  const draft = await updateLoanDraftService(
    draftId,
    req.body
  );

  res.json({
    success: true,
    data: draft
  });
};

export const getDraftController = async (req: Request, res: Response) => {
  const draftId = getRouteId(req.params.id);

  const draft = await getLoanDraftByIdService(draftId);

  res.json({
    success: true,
    data: draft,
  });
};

export const submitDraftController = async (req:Request, res:Response) => {
  if (!req.user?.id) {
    throw new Error("Unauthorized user context");
  }

  const draftId = getRouteId(req.params.id);

  const result = await submitLoanDraftService(
    draftId,
    {
      id: req.user.id,
      role: req.user.role as Enums.Role,
    }
  );

  res.json({
    success: true,
    data: result
  });
};