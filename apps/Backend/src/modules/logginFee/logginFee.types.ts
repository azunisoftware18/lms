export type LoginFeePaymentMode = "CASH" | "UPI" | "BANK" | "CHEQUE";

export type LoginFeeStatus =
	| "PENDING"
	| "PAID"
	| "FAILED"
	| "REFUNDED"
	| "CANCELLED";

export type LoginFeeInstitutionType = "NBFC" | "BANKING";

/**
 * LoginFeeRecord represents a login fee charge for a lead
 * - Immutable once created
 * - Status can only be changed through system actions (charge, pay)
 * - Users cannot manually update status
 */
export interface LoginFeeRecord {
	id: string;
	applicationNumber: string;
	leadId: string;
	leadNumber: string;
	applicantName: string;
	mobileNumber: string;
	email: string;
	loanAmount: number;
	feeAmount: number;
	gstAmount: number;
	totalAmount: number;
	paymentMode: LoginFeePaymentMode;
	transactionId?: string | null;
	status: LoginFeeStatus;
	institutionType: LoginFeeInstitutionType;
	institutionName?: string | null;
	bankName?: string | null;
	branchName?: string | null;
	ifscCode?: string | null;
	accountNumber?: string | null;
	remarks?: string | null;
	chargedAt: string;
	chargedBy: string;
	paidAt?: string | null;
	paidBy?: string | null;
	branchId: string;
}

/**
 * Input for creating a new login fee
 */
export interface CreateLoginFeeInput {
	leadId: string;
	applicantName: string;
	mobileNumber: string;
	email: string;
	loanAmount?: number;
	feeAmount: number;
	paymentMode: LoginFeePaymentMode;
	transactionId?: string;
	institutionType?: LoginFeeInstitutionType;
	institutionName?: string;
	bankName?: string;
	branchName?: string;
	ifscCode?: string;
	accountNumber?: string;
	remarks?: string;
}

/**
 * Query filters for listing login fees
 */
export interface LoginFeeQueryInput {
	page?: number;
	limit?: number;
	q?: string;
	status?: LoginFeeStatus;
	paymentMode?: LoginFeePaymentMode;
	institutionType?: LoginFeeInstitutionType;
	dateFrom?: string;
	dateTo?: string;
}
