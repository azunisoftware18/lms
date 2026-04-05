import { apiGet, apiPost } from "./apiClient";

export const getDefaultedLoanById = (loanId) => {
  return apiGet(`/loan-default/defaulted/${loanId}`);
};

export const checkLoanDefault = (loanId) => {
  return apiPost(`/loan-default/${loanId}/check`);
};

export default {
  getDefaultedLoanById,
  checkLoanDefault,
};
