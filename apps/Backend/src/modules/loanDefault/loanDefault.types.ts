export interface RequesterContext {
  id: string;
  role: string;
  branchId?: string | null;
}

export interface LoanDefaultQueryParams {
  page?: number;
  limit?: number;
  branchId?: string;
}

export interface LoanDefaultCheckResult {
  status?: "active" | "delinquent" | "defaulted";
  dpd?: number | null;
  outstandingAmount?: number;
  isDefaulted?: boolean;
  skipped?: boolean;
  reason?: "already_defaulted";
}
