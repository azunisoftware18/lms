import api from "../api";
import { getErrorMessage } from "../utils/errorHandler";

export const getAllSettlements = async (params) => {
 try {  const res = await api.get("/settlements", { params });
  return res.data;
} catch (error) {
  throw new Error(getErrorMessage(error));
}
};

export const applySettlement = async ({ recoveryId, data }) => {
  try {
    const res = await api.post(`/recoveries/${recoveryId}/apply-settlement`, data);
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const approveSettlement = async ({ recoveryId, data }) => {
  try {
    const res = await api.post(`/recoveries/${recoveryId}/settlement/approve`, data);
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const paySettlement = async ({ recoveryId, data }) => {
  try {
    const res = await api.post(`/recoveries/${recoveryId}/settlement/pay`, data);
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const rejectSettlement = async ({ recoveryId, data }) => {
  try {
    const res = await api.post(`/recoveries/${recoveryId}/settlement/reject`, data);
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getPayableAmount = async (recoveryId) => {
  try {
    const res = await api.get(`/recoveries/${recoveryId}/settlement/payable-amount`);
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getSettlementDashboard = async () => {
  try {
    const res = await api.get("/settlements/dashboard");
    return res.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};