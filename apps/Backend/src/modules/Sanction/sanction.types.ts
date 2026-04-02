export interface SanctionCreateInput {
	loanApplicationId: string;
	sanctionedAmount: number;
	currency?: string;
	remarks?: string;
	documents?: any;
}

export interface SanctionUpdateInput {
	sanctionedAmount?: number;
	status?: "PENDING" | "APPROVED" | "REJECTED" | "PARTIAL";
	approvedBy?: string;
	approvedAt?: Date | string | null;
	remarks?: string;
	documents?: any;
}

export type RequesterContext = {
	id: string;
	role: string;
	branchId?: string | null;
};

export type SanctionListQuery = {
	page?: number;
	limit?: number;
	status?: string;
	loanApplicationId?: string;
};
