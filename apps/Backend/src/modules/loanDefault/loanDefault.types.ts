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
