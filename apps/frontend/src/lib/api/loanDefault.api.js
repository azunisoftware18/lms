import api from "../api";

export const getDefaultedLoans = async () => {
  const res = await api.get("/loan-default/defaulted");
  return res.data;
};

export const getDefaultedLoanById = async (loanId) => {
  const res = await api.get(`/loan-default/defaulted/${loanId}`);
  return res.data;
};

export const checkLoanDefault = async (loanId) => {
  const res = await api.post(`/loan-applications/loans/${loanId}/check-default`);
  return res.data;
};