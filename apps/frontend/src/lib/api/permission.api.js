import api from "../api";
import { getErrorMessage } from "../utils/errorHandler";

export const createPermission = async (data) => {
  try {
    const res = await api.post("/permissions/create-permissions", data);
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
  
};

export const assignPermissions = async (data) => {
  try {
    const res = await api.post("/permissions/assign", data);
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getUserPermissions = async (userId) => {
  try {
    const res = await api.get(`/permissions/user/${userId}`);
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getAllPermissions = async () => {
  try {
    const res = await api.get("/permissions/all-permissions");
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};