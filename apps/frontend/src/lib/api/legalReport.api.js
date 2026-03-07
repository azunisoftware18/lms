import api from "../api";

import { getErrorMessage } from "../utils/errorHandler";
export const getAllLegalReports = async (params) => {
  try {
    const res = await api.get("/legal-reports", { params });
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createLegalReport = async ({ loanId, data }) => {
  try {
    const res = await api.post(`/loan/${loanId}/legal-report`, data);
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const approveLegalReport = async (reportId) => {
  try {
    const res = await api.post(`/legal-report/${reportId}/approve`);
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
