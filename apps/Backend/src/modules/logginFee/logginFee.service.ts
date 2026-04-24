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
const ACTION_UPDATE = "UPDATE_LOGIN_FEE_STATUS";

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
		branchId: String(value.branchId || ""),
	} as LoginFeeRecord;
};

const buildLatestRecords = (logs: any[]): LoginFeeRecord[] => {
	const map = new Map<string, LoginFeeRecord>();

	for (const log of logs) {
		if (map.has(log.entityId)) continue;
		const record = normalizeRecord(log.newValue);
		if (record) map.set(log.entityId, record);
	}

	return Array.from(map.values());
};

const parseDate = (value?: string) => {
	if (!value) return null;
	const parsed = new Date(value);
	return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const filterRecords = (records: LoginFeeRecord[], query: LoginFeeQueryInput) => {
	const q = (query.q || "").toLowerCase();
	const from = parseDate(query.dateFrom);
	const to = parseDate(query.dateTo);

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

export const createLogginFeeService = async (
	payload: CreateLoginFeeInput,
	userId: string,
	branchId: string,
) => {
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

	const feeAmount = Number(payload.feeAmount || 0);
	const gstAmount = Number((feeAmount * 0.18).toFixed(2));
	const totalAmount = Number((feeAmount + gstAmount).toFixed(2));

	const record: LoginFeeRecord = {
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
		chargedAt: new Date().toISOString(),
		chargedBy: userId,
		branchId,
	};

	await prisma.auditLog.create({
		data: {
			entityType: ENTITY_TYPE,
			entityId: record.id,
			action: ACTION_CHARGE,
			performedBy: userId,
			branchId,
			newValue: record as any,
			remarks: "Login fee charged",
		},
	});

	return record;
};

export const listLogginFeeService = async (query: LoginFeeQueryInput) => {
	const page = Number(query.page || 1);
	const limit = Number(query.limit || 10);

	const logs = await prisma.auditLog.findMany({
		where: {
			entityType: ENTITY_TYPE,
			action: {
				in: [ACTION_CHARGE, ACTION_UPDATE],
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	const latestRecords = buildLatestRecords(logs);
	const filtered = filterRecords(latestRecords, query);
	const total = filtered.length;
	const totalPages = Math.max(1, Math.ceil(total / limit));
	const start = (page - 1) * limit;
	const data = filtered.slice(start, start + limit);

	return {
		data,
		meta: {
			page,
			limit,
			total,
			totalPages,
		},
	};
};

export const getLogginFeeByIdService = async (id: string) => {
	const logs = await prisma.auditLog.findMany({
		where: {
			entityType: ENTITY_TYPE,
			entityId: id,
			action: {
				in: [ACTION_CHARGE, ACTION_UPDATE],
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	if (!logs.length) {
		throw AppError.notFound("Login fee record not found");
	}

	const record = normalizeRecord(logs[0].newValue);
	if (!record) {
		throw AppError.notFound("Login fee record not found");
	}

	return record;
};

export const updateLogginFeeStatusService = async (
	id: string,
	status: LoginFeeStatus,
	userId: string,
	branchId: string,
	remarks?: string | null,
) => {
	const current = await getLogginFeeByIdService(id);
	const updated: LoginFeeRecord = {
		...current,
		status,
		remarks: remarks ?? current.remarks,
	};

	await prisma.auditLog.create({
		data: {
			entityType: ENTITY_TYPE,
			entityId: id,
			action: ACTION_UPDATE,
			performedBy: userId,
			branchId,
			oldValue: current as any,
			newValue: updated as any,
			remarks: `Login fee status updated to ${status}`,
		},
	});

	return updated;
};
