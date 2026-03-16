
import { z } from "zod";

export const uploadKycDocumentSchema = z.object({
  kycId: z.string().min(1),
  documentType: z.string().trim().min(1),
});

export const kycParamSchema = z.object({
  id: z.string().min(1, "id is required"),
});

export const rejectDocumentBodySchema = z.object({
  reason: z.string().trim().optional(),
});

export const createRequiredKycDocumentSchema = z
  .object({
    documentType: z.string().trim().min(1, "documentType is required"),
    displayName: z.string().trim().min(1).optional(),
    isActive: z.coerce.boolean().optional(),
  })
  .strict();
