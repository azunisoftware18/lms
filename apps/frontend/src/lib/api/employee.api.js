import api from '../api';
import { getErrorMessage } from '../utils/errorHandler';

/**
 * Employee API functions with proper error handling
 */

export const createEmployee = async (data) => {
    try {
        const res = await api.post('/employee', data);
        return res.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

export const getEmployees = async (params) => {
    try {
        const res = await api.get('/employee/all', {
            params: {
                page: params?.page || 1,
                limit: params?.limit || 10,
                q: params?.q || '',
            },
        });

        // Backend currently responds with { success, message, data: { data, meta } }
        // Return the normalized list payload so hooks/slices can consume pagination safely.
        return res.data?.data ?? res.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

export const getEmployeeById = async (id) => {
    try {
        const res = await api.get(`/employee/${id}`);
        return res.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

export const updateEmployee = async (id, data) => {
    try {
        const res = await api.patch(`/employee/${id}`, data);
        return res.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

export const deleteEmployee = async (id) => {
    try {
        const res = await api.delete(`/employee/${id}`);
        return res.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

export const getEmployeeByBranchId = async (branchId) => {
    try {
        const res = await api.get(`/employee/branch/${branchId}`);
        return res.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

export const getEmployeeDashboard = async () => {
    try {
        const res = await api.get('/employee/dashboard');
        return res.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

