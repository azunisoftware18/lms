import api from "../api";
import { getErrorMessage } from "../utils/errorHandler";

export const createLoanDraft = async () => {
  try {
    const res = await api.post("/loan-drafts");
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateLoanDraft = async ({ id, data }) => {
  try {
    const res = await api.patch(`/loan-drafts/${id}`, data);
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getLoanDraftById = async (id) => {
  try {
    const res = await api.get(`/loan-drafts/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const submitLoanDraft = async (id) => {
  try {
    const res = await api.post(`/loan-drafts/${id}/submit`);
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
