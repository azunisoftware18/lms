import api from "../api";
import { getErrorMessage } from "../utils/errorHandler";

/**
 * Branch API functions with proper error handling
 */

export const createbranch = async (branchData) => {
  try {
    const response = await api.post("/branches", branchData);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getBranches = async () => {
  try {
    const res = await api.get("/branches");
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getBranchById = async (id) => {
  try {
    const res = await api.get(`/branches/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateBranch = async (id, branchData) => {
  try {
    const res = await api.put(`/branches/${id}`, branchData);
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteBranch = async (id) => {
  try {
    const res = await api.delete(`/branches/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getMainBranches = async () => {
  try {
    const res = await api.get("/branches/main");
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
