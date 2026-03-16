import api from "../api";
import { getErrorMessage } from "../utils/errorHandler";

export const createLoanType = async (data) => {
  try {
    const res = await api.post("/loantypes", data);
    return res.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getLoanTypes = async (params) => {
  try {
    const res = await api.get("/loantypes", { params });
    return res.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateLoanType = async ({ id, data }) => {
  try {
    const res = await api.put(`/loantypes/${id}`, data);
    return res.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteLoanType = async (id) => {
  try {
    const res = await api.delete(`/loantypes/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
