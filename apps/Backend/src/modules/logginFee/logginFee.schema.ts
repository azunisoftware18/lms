import { z } from "zod";

const paymentModeEnum = z.enum(["CASH", "UPI", "BANK", "CHEQUE"]);
const statusEnum = z.enum(["PENDING", "PAID", "FAILED", "REFUNDED", "CANCELLED"]);
const institutionTypeEnum = z.enum(["NBFC", "BANKING"]);

export const createLogginFeeSchema = z
	.object({
		leadId: z.string().trim().min(1, "leadId is required"),
		applicantName: z.string().trim().min(1, "applicantName is required"),
		mobileNumber: z.string().trim().min(10, "mobileNumber is required"),
		email: z.string().trim().email("Valid email is required"),
		loanAmount: z.coerce.number().nonnegative().optional(),
		feeAmount: z.coerce.number().positive("feeAmount must be greater than 0"),
		paymentMode: paymentModeEnum.default("UPI"),
		transactionId: z.string().trim().optional().nullable(),
		institutionType: institutionTypeEnum.default("NBFC"),
		institutionName: z.string().trim().optional().nullable(),
		bankName: z.string().trim().optional().nullable(),
		branchName: z.string().trim().optional().nullable(),
		ifscCode: z.string().trim().optional().nullable(),
		accountNumber: z.string().trim().optional().nullable(),
		remarks: z.string().trim().optional().nullable(),
	})
	.superRefine((value, ctx) => {
		if (value.institutionType === "BANKING") {
			if (!value.bankName) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					path: ["bankName"],
					message: "bankName is required for banking payments",
				});
			}
			if (!value.ifscCode) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					path: ["ifscCode"],
					message: "ifscCode is required for banking payments",
				});
			}
		}
	});

export const logginFeeIdParamSchema = z.object({
	id: z.string().trim().min(1, "id is required"),
});

export const listLogginFeeQuerySchema = z.object({
	page: z.coerce.number().int().positive().optional(),
	limit: z.coerce.number().int().positive().max(100).optional(),
	q: z.string().trim().optional(),
	status: statusEnum.optional(),
	paymentMode: paymentModeEnum.optional(),
	institutionType: institutionTypeEnum.optional(),
	dateFrom: z.string().datetime().optional(),
	dateTo: z.string().datetime().optional(),
});
