export type LoginFeePaymentMode = "CASH" | "UPI" | "BANK" | "CHEQUE";

export type LoginFeeStatus =
	| "PENDING"
	| "PAID"
	| "FAILED"
	| "REFUNDED"
	| "CANCELLED";

export type LoginFeeInstitutionType = "NBFC" | "BANKING";

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
	branchId: string;
}

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
