import api from '../api';
import { getErrorMessage } from '../utils/errorHandler';

/**
 * Branch Admin API functions with proper error handling
 */

export const createBranchAdmin = async (data) => {
    try {
        const res = await api.post('/branch-admin', data);
        return res.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

export const getBranchAdmins = async () => {
    try {
        const res = await api.get('/branch-admin');
        return res.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

export const getBranchAdminById = async (id) => {
    try {
        const res = await api.get(`/branch-admin/${id}`);
        return res.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

export const updateBranchAdmins = async (id, data) => {
    try {
        const res = await api.put(`/branch-admin/${id}`, data);
        return res.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

export const deleteBranchAdmin = async (id) => {
    try {
        const res = await api.delete(`/branch-admin/${id}`);
        return res.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

