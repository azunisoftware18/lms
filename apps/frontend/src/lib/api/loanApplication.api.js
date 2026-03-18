import api from "../api";

import { getErrorMessage } from "../utils/errorHandler";

export const createLoanApplication = async (data) => {
  try {
    const res = await api.post("/loan-applications/loan/create", data);
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getLoanApplications = async (params) => {
  try {
    const res = await api.get("/loan-applications", {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        q: params?.q || "",
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getLoanApplicationById = async (id) => {
  try {
    const res = await api.get(`/loan-applications/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateLoanApplicationStatus = async (id, status) => {
  try {
    const res = await api.patch(`/loan-applications/${id}/status`, { status });
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const reviewLoanApplication = async (id) => {
  try {
    const res = await api.post(`/loan-applications/${id}/review`);
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const approveLoanApplication = async (id) => {
  try {
    const res = await api.post(`/loan-applications/${id}/approve`);
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const rejectLoanApplication = async (id, reason) => {
  try {
    const res = await api.post(`/loan-applications/${id}/reject`, { reason });
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const uploadLoanApplicationDocument = async (id, file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post(`/loan-applications/${id}/documents`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const rejectDocument = async (applicationId, documentId, reason) => {
  try {
    const res = await api.post(
      `/loan-applications/${applicationId}/documents/${documentId}/reject`,
      { reason },
    );
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const verifyDocument = async (documentId) => {
  try {
    const res = await api.post(
      `/loan-applications/documents/${documentId}/verify`,
    );
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getLoanDocuments = async (applicationId) => {
  try {
    const res = await api.get(`/loan-applications/${applicationId}/documents`);
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
