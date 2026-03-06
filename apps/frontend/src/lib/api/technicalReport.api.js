import api from "../api";

export const getAllTechnicalReports = async (params) => {
  const res = await api.get("/technical-reports", { params });
  return res.data;
};

export const createTechnicalReport = async ({ loanId, data }) => {
  const res = await api.post(
    `/loan-applications/${loanId}/technical-reports`,
    data
  );
  return res.data;
};

export const approveTechnicalReport = async (reportId) => {
  const res = await api.post(`/technical-reports/${reportId}/approve`);
  return res.data;
};