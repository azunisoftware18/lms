import api from '../api';
import { getErrorMessage } from '../utils/errorHandler';

/**
 * Co-Applicant API functions with proper error handling
 */
export const uploadCoApplicantDocument = async ({ coApplicantId, files }) => {
    try {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });

        const res = await api.post(`/co-applicant/documents/${coApplicantId}/upload`, formData);
        return res.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

export const reuploadCoApplicantDocument = async ({
    coApplicantId,
    documentType,
    file
}) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await api.post(`/co-applicant/documents/${coApplicantId}/${documentType}/reupload`, formData);
        return res.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

export const getCoApplicants = async (loanApplicationId) => {
    try {
        const res = await api.get(`/co-applicant/${loanApplicationId}`);
        return res.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

export const getCoApplicantById = async (id) => {
    try {
        const res = await api.get(`/co-applicant/detail/${id}`);
        return res.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

export const createCoApplicant = async (data) => {
    try {
        const res = await api.post('/co-applicant', data);
        return res.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

export const updateCoApplicant = async (id, data) => {
    try {
        const res = await api.put(`/co-applicant/${id}`, data);
        return res.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

export const deleteCoApplicant = async (id) => {
    try {
        const res = await api.delete(`/co-applicant/${id}`);
        return res.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};