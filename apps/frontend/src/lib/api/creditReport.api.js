import api from '../api';
import { getErrorMessage } from '../utils/errorHandler';

/**
 * Credit Report API functions with proper error handling
 */

export const refreshCreditReport = async (data) => {
    try {
        const res = await api.post('/credit-report/refresh', data);
        return res.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

export const getCreditReports = async (applicantId) => {
    try {
        const res = await api.get(`/credit-report/${applicantId}`);
        return res.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

export const getCreditReportById = async (id) => {
    try {
        const res = await api.get(`/credit-report/detail/${id}`);
        return res.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

export const createCreditReport = async (data) => {
    try {
        const res = await api.post('/credit-report', data);
        return res.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

export const deleteCreditReport = async (id) => {
    try {
        const res = await api.delete(`/credit-report/${id}`);
        return res.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};


