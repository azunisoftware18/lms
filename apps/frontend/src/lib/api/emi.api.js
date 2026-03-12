import api from '../api';
import { getErrorMessage } from '../utils/errorHandler';

/**
 * EMI API functions with proper error handling
 */

export const getAllEmis = async (params) => {
    try {
        const res = await api.get('/emi', { params:{
        page: params?.page || 1,
        limit: params?.limit || 10,
        q:params?.q|| "",
        } });
        return res.data?.data ?? res.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

export const generateEmiSchedule = async (loanId) => {
    try {
        const res = await api.post(`/emi/loan-application/${loanId}/emis`);
        return res.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

export const getLoanEmis = async (loanId) => {
    try {
        const res = await api.get(`/emi/loan-application/${loanId}/emis`);
        return res.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

export const payEmi = async ({ emiId, amountPaid, paymentMode }) => {
    try {
        const res = await api.post(`/emi/${emiId}/pay`, {
            amountPaid,
            paymentMode
        });
        return res.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

export const getEmiPayableAmount = async (emiId) => {
    try {
        const res = await api.get(`/emi/${emiId}/payable-amount`);
        return res.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

export const calculateEmi = async (data) => {
    try {
        const res = await api.post('/emis/get-emi-amount', data);
        return res.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

export const forecloseLoan = async (loanId) => {
    try {
        const res = await api.get(`/emis/loans/${loanId}/foreclose`);
        return res.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

export const applyMoratorium = async ({ loanId, data }) => {
    try {
        const res = await api.post(`/emis/loans/${loanId}/moratorium`, data);
        return res.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};