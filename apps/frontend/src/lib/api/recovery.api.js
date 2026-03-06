import api from "../api";

import { getErrorMessage } from "../utils/errorHandler";

export const getAllRecoveries = async (params) => {
  try {
    const res = await api.get("/recoveries", { params });
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getRecoveryDetails = async (recoveryId) => {
  try {
     const res = await api.get(`/recoveries/${recoveryId}`);
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const payRecovery = async ({ recoveryId, data }) => {
  try {
    const res = await api.post(`/recoveries/${recoveryId}/pay`, data);
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const assignRecoveryAgent = async ({ recoveryId, data }) => {
  try {
    const res = await api.post(`/recoveries/${recoveryId}/assign`, data);
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateRecoveryStage = async ({ recoveryId, data }) => {
  try {
    const res = await api.put(`/recoveries/${recoveryId}/stage`, data);
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getRecoveryDashboard = async () => {
  try {
    const res = await api.get("/dashboard");
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getAgentRecoveries = async (agentId) => {
  try {
    const res = await api.get(`/agents/${agentId}/recoveries`);
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};