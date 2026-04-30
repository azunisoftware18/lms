import { prisma } from "../../db/prismaService.js";
import { AppError } from "../../common/utils/apiError.js";
import {
	CreateLoginFeeInput,
	LoginFeeQueryInput,
	LoginFeeRecord,
	LoginFeeStatus,
} from "./logginFee.types.js";

const ENTITY_TYPE = "LOGIN_FEE";
const ACTION_CHARGE = "CHARGE_LOGIN_FEE";
const ACTION_PAY = "PAY_LOGIN_FEE";

/**
 * Generates a unique application number with format: APP-YYYYMMDD-XXXXX
 */
const generateApplicationNumber = () => {
	const date = new Date();
	const yyyy = date.getFullYear();
	const mm = String(date.getMonth() + 1).padStart(2, "0");
	const dd = String(date.getDate()).padStart(2, "0");
	const random = Math.floor(Math.random() * 100000)
		.toString()
		.padStart(5, "0");
	return `APP-${yyyy}${mm}${dd}-${random}`;
};

/**
 * Generates a unique login fee record ID with format: LF-YYYYMMDD-XXXXX
 */
const generateLoginFeeId = () => {
	const date = new Date();
	const yyyy = date.getFullYear();
	const mm = String(date.getMonth() + 1).padStart(2, "0");
	const dd = String(date.getDate()).padStart(2, "0");
	const random = Math.floor(Math.random() * 100000)
		.toString()
		.padStart(5, "0");
	return `LF-${yyyy}${mm}${dd}-${random}`;
};

/**
 * Normalizes a database record to LoginFeeRecord type
 */
const normalizeRecord = (value: any): LoginFeeRecord | null => {
	if (!value || typeof value !== "object") return null;
	if (!value.id || !value.applicationNumber || !value.leadId) return null;

	return {
		id: String(value.id),
		applicationNumber: String(value.applicationNumber),
		leadId: String(value.leadId),
		leadNumber: String(value.leadNumber || ""),
		applicantName: String(value.applicantName || ""),
		mobileNumber: String(value.mobileNumber || ""),
		email: String(value.email || ""),
		loanAmount: Number(value.loanAmount || 0),
		feeAmount: Number(value.feeAmount || 0),
		gstAmount: Number(value.gstAmount || 0),
		totalAmount: Number(value.totalAmount || 0),
		paymentMode: value.paymentMode,
		transactionId: value.transactionId ?? null,
		status: value.status,
		institutionType: value.institutionType || "NBFC",
		institutionName: value.institutionName ?? null,
		bankName: value.bankName ?? null,
		branchName: value.branchName ?? null,
		ifscCode: value.ifscCode ?? null,
		accountNumber: value.accountNumber ?? null,
		remarks: value.remarks ?? null,
		chargedAt: String(value.chargedAt || new Date().toISOString()),
		chargedBy: String(value.chargedBy || ""),
		paidAt: value.paidAt ? String(value.paidAt) : null,
		paidBy: value.paidBy ? String(value.paidBy) : null,
		branchId: String(value.branchId || ""),
	} as LoginFeeRecord;
};

/**
 * Maps audit log status to Leads-compatible status
 */
const mapLeadLoginFeeStatus = (
	status: LoginFeeStatus,
): "PENDING" | "PAID" | "WAIVED" | "FAILED" => {
	if (status === "PENDING" || status === "PAID" || status === "FAILED") {
		return status;
	}
	return "FAILED";
};

/**
 * Filters login fee records based on query parameters
 */
const filterRecords = (records: LoginFeeRecord[], query: LoginFeeQueryInput) => {
	const q = (query.q || "").toLowerCase();
	const from = query.dateFrom ? new Date(query.dateFrom) : null;
	const to = query.dateTo ? new Date(query.dateTo) : null;

	return records.filter((item) => {
		if (query.status && item.status !== query.status) return false;
		if (query.paymentMode && item.paymentMode !== query.paymentMode) return false;
		if (query.institutionType && item.institutionType !== query.institutionType) return false;

		if (from || to) {
			const chargedAt = new Date(item.chargedAt);
			if (from && chargedAt < from) return false;
			if (to && chargedAt > to) return false;
		}

		if (!q) return true;
		return (
			item.applicationNumber.toLowerCase().includes(q) ||
			item.leadNumber.toLowerCase().includes(q) ||
			item.applicantName.toLowerCase().includes(q) ||
			item.mobileNumber.toLowerCase().includes(q) ||
			item.email.toLowerCase().includes(q) ||
			item.transactionId?.toLowerCase().includes(q)
		);
	});
};

/**
 * Retrieves the latest login fee record for a given lead ID
 */
const getLatestLoginFeeRecordByLeadId = async (leadId: string) => {
	const record = await prisma.loginFeeRecord.findFirst({
		where: {
			leadId,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	if (!record) return null;
	return normalizeRecord(record);
};

/**
 * Creates a new login fee charge for a lead
 * @throws AppError if lead not found or fee already exists
 */
export const createLogginFeeService = async (
	payload: CreateLoginFeeInput,
	userId: string,
	branchId: string,
) => {
	// Validate and fetch lead
	const lead = await prisma.leads.findFirst({
		where: {
			OR: [{ id: payload.leadId }, { leadNumber: payload.leadId }],
		},
		select: {
			id: true,
			leadNumber: true,
			fullName: true,
			contactNumber: true,
			email: true,
			loanAmount: true,
		},
	});

	if (!lead) {
		throw AppError.notFound("Lead not found");
	}

	// Check for existing non-FAILED login fee
	const existingRecord = await getLatestLoginFeeRecordByLeadId(lead.id);
	if (existingRecord) {
		if (existingRecord.status === "FAILED") {
			// Allow recharge for failed attempts
			return existingRecord;
		}
		throw AppError.badRequest(
			`Login fee already: ${existingRecord.status}. `
		);
	}

	// Calculate amounts
	const feeAmount = Number(payload.feeAmount || 0);
	const gstAmount = Number((feeAmount * 0.18).toFixed(2));
	const totalAmount = Number((feeAmount + gstAmount).toFixed(2));

	// Create login fee record in database
	const dbRecord = await prisma.loginFeeRecord.create({
		data: {
			id: generateLoginFeeId(),
			applicationNumber: generateApplicationNumber(),
			leadId: lead.id,
			leadNumber: lead.leadNumber,
			applicantName: payload.applicantName || lead.fullName,
			mobileNumber: payload.mobileNumber || lead.contactNumber,
			email: payload.email || lead.email,
			loanAmount: Number(payload.loanAmount ?? lead.loanAmount ?? 0),
			feeAmount,
			gstAmount,
			totalAmount,
			paymentMode: payload.paymentMode,
			transactionId: payload.transactionId || null,
			status: "PENDING",
			institutionType: payload.institutionType || "NBFC",
			institutionName: payload.institutionName || null,
			bankName: payload.bankName || null,
			branchName: payload.branchName || null,
			ifscCode: payload.ifscCode || null,
			accountNumber: payload.accountNumber || null,
			remarks: payload.remarks || null,
			chargedBy: userId,
			branchId,
		},
	});

	// Log action to audit log
	await prisma.auditLog.create({
		data: {
			entityType: ENTITY_TYPE,
			entityId: dbRecord.id,
			action: ACTION_CHARGE,
			performedBy: userId,
			branchId,
			newValue: dbRecord as any,
			remarks: `Login fee charged for lead ${lead.leadNumber}`,
		},
	});

	return normalizeRecord(dbRecord);
};

/**
 * Lists all login fee records with pagination and filtering
 */
export const listLogginFeeService = async (query: LoginFeeQueryInput) => {
	const page = Number(query.page || 1);
	const limit = Number(query.limit || 10);

	// Build filter conditions
	const where: any = {};
	
	if (query.status) where.status = query.status;
	if (query.paymentMode) where.paymentMode = query.paymentMode;
	if (query.institutionType) where.institutionType = query.institutionType;
	
	if (query.dateFrom || query.dateTo) {
		where.chargedAt = {};
		if (query.dateFrom) where.chargedAt.gte = new Date(query.dateFrom);
		if (query.dateTo) where.chargedAt.lte = new Date(query.dateTo);
	}

	// Search in specific fields
	if (query.q) {
		const searchQuery = query.q.toLowerCase();
		where.OR = [
			{ applicationNumber: { contains: searchQuery } },
			{ leadNumber: { contains: searchQuery } },
			{ applicantName: { contains: searchQuery } },
			{ mobileNumber: { contains: searchQuery } },
			{ email: { contains: searchQuery } },
			{ transactionId: { contains: searchQuery } },
		];
	}

	// Fetch total count and paginated records
	const [total, records] = await Promise.all([
		prisma.loginFeeRecord.count({ where }),
		prisma.loginFeeRecord.findMany({
			where,
			orderBy: {
				createdAt: "desc",
			},
			skip: (page - 1) * limit,
			take: limit,
		}),
	]);

	const totalPages = Math.max(1, Math.ceil(total / limit));

	return {
		data: records.map((r: any) => normalizeRecord(r)).filter(Boolean),
		meta: {
			page,
			limit,
			total,
			totalPages,
		},
	};
};

/**
 * Retrieves a single login fee record by ID
 */
export const getLogginFeeByIdService = async (id: string) => {
	const record = await prisma.loginFeeRecord.findUnique({
		where: { id },
	});

	if (!record) {
		throw AppError.notFound(`Login fee record with ID ${id} not found`);
	}

	return normalizeRecord(record)!;
};

/**
 * Marks a login fee as PAID and atomically updates the Leads table
 * @throws AppError if record not found, already paid, or not latest for lead
 */
export const payLogginFeeService = async (
	id: string,
	userId: string,
	branchId: string,
) => {
	// Fetch the fee record (throws if not found)
	const current = await getLogginFeeByIdService(id);
	
	// Verify it's the latest fee for this lead
	const latestForLead = await getLatestLoginFeeRecordByLeadId(current.leadId);
	if (!latestForLead || latestForLead.id !== current.id) {
		throw AppError.badRequest(
			"Only the latest login fee record for this lead can be paid"
		);
	}

	// Check if already paid
	if (current.status === "PAID" || latestForLead.status === "PAID") {
		throw AppError.badRequest("Login fee is already marked as PAID");
	}

	// Generate transaction ID
	const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
	const now = new Date();

	// Update in transaction for data consistency
	const updated = await prisma.$transaction(async (tx) => {
		// Update LoginFeeRecord
		const updatedRecord = await tx.loginFeeRecord.update({
			where: { id },
			data: {
				status: "PAID",
				transactionId,
				paidAt: now,
				paidBy: userId,
			},
		});

		// Update Leads table
		await tx.leads.update({
			where: { id: current.leadId },
			data: {
				loginFeeStatus: "PAID",
				transactionId,
			},
		});

		// Log to audit trail
		await tx.auditLog.create({
			data: {
				entityType: ENTITY_TYPE,
				entityId: id,
				action: ACTION_PAY,
				performedBy: userId,
				branchId,
				oldValue: current as any,
				newValue: updatedRecord as any,
				remarks: `Login fee marked as PAID with transaction ID ${transactionId}`,
			},
		});

		return updatedRecord;
	});

	return normalizeRecord(updated)!;
};