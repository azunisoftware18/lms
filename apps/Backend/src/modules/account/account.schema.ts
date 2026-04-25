// src/modules/account/account.schema.ts
import { z } from 'zod';

export const createAccountSchema = z.object({
  body: z.object({
    code: z.string()
      .min(1, 'Account code is required')
      .max(20, 'Account code must be less than 20 characters'),
    name: z.string()
      .min(1, 'Account name is required')
      .max(100, 'Account name must be less than 100 characters'),
    type: z.enum(['ASSET', 'LIABILITY', 'INCOME', 'EXPENSE']),
    parentAccountId: z.string().nullable().optional(),
    openingBalance: z.number().min(0).default(0).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE').optional(),
    description: z.string().max(500).optional()
  })
});

export const updateAccountSchema = z.object({
  body: z.object({
    code: z.string().min(1).max(20).optional(),
    name: z.string().min(1).max(100).optional(),
    type: z.enum(['ASSET', 'LIABILITY', 'INCOME', 'EXPENSE']).optional(),
    parentAccountId: z.string().nullable().optional(),
    openingBalance: z.number().min(0).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
    description: z.string().max(500).optional()
  })
});