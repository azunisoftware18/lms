import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { apiGet, apiPost, apiPut, apiDelete } from '../lib/api/apiClient';
import { showSuccess, showError } from '../lib/utils/toastService';
import { normalizeParams } from '../lib/utils/paramHelper';
import {    setCoApplicants,
    setLoading,
    setError,
    addCoApplicant,
    updateCoApplicantInList,
    removeCoApplicantFromList,
    clearError,
} from '../store/slices/coApplicationSlice';

export const useCoApplicants = (loanApplicationId, params = {}) => {
    const dispatch = useDispatch();
    const coApplicants = useSelector(state => state.coApplication.coApplicants);
    const loading = useSelector(state => state.coApplication.loading);
    const error = useSelector(state => state.coApplication.error);

    const normalizedParams = normalizeParams(params);

    const query = useQuery(
        ['coApplicants', loanApplicationId, normalizedParams],
        () => apiGet(`/co-applicant/${loanApplicationId}`, {
            params: normalizedParams,
        }),
        {
            enabled: !!loanApplicationId,
            onSuccess: (data) => {
                dispatch(setCoApplicants(data));
                dispatch(clearError());
            },
            onError: (error) => {
                const message = error?.message || 'Failed to fetch co-applicants';
                dispatch(setError(message));
                showError(message);
            },
            staleTime: 1000 * 60 * 5, // 5 minutes
        }
    );

    return {
        coApplicants,
        loading: query.isLoading || loading,
        error: error || query.error,
        isFetching: query.isFetching,
        refetch: query.refetch,
    };
};

export const useCoApplicantById = (id) => {
    const dispatch = useDispatch();

    return useQuery(
        ['coApplicant', id],
        () => apiGet(`/co-applicant/detail/${id}`),
        {
            enabled: !!id,
            onSuccess: (data) => {
                dispatch(clearError());
            },
            onError: (error) => {
                const message = error?.message || `Failed to fetch co-applicant`;
                dispatch(setError(message));
                showError(message);
            },
            staleTime: 1000 * 60 * 5,
        }
    );
};

export const useCreateCoApplicant = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation((payload) => apiPost('/co-applicant', payload), {
        onMutate: () => {
            dispatch(setLoading(true));
        },
        onSuccess: (data) => {
            dispatch(addCoApplicant(data));
            queryClient.invalidateQueries(['coApplicants']);
            dispatch(setLoading(false));
            dispatch(clearError());
            showSuccess('Co-applicant created successfully!');
        },
        onError: (error) => {
            const message = error?.message || 'Failed to create co-applicant';
            dispatch(setError(message));
            dispatch(setLoading(false));
            showError(message);
        },
    });
};

export const useUpdateCoApplicant = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation(
        ({ id, data }) => apiPut(`/co-applicant/${id}`, data),
        {
            onMutate: () => {
                dispatch(setLoading(true));
            },
            onSuccess: (data) => {
                dispatch(updateCoApplicantInList(data));
                queryClient.invalidateQueries(['coApplicants']);
                dispatch(setLoading(false));
                dispatch(clearError());
                showSuccess('Co-applicant updated successfully!');
            },
            onError: (error) => {
                const message = error?.message || 'Failed to update co-applicant';
                dispatch(setError(message));
                dispatch(setLoading(false));
                showError(message);
            },
        }
    );
};

export const useDeleteCoApplicant = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation((id) => apiDelete(`/co-applicant/${id}`), {
        onMutate: () => {
            dispatch(setLoading(true));
        },
        onSuccess: (data, variables) => {
            dispatch(removeCoApplicantFromList(variables));
            queryClient.invalidateQueries(['coApplicants']);
            dispatch(setLoading(false));
            dispatch(clearError());
            showSuccess('Co-applicant deleted successfully!');
        },
        onError: (error) => {
            const message = error?.message || 'Failed to delete co-applicant';
            dispatch(setError(message));
            dispatch(setLoading(false));
            showError(message);
        },
    });
};

export const useUploadCoApplicantDocument = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation(({ coApplicantId, files }) => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });
        return apiPost(`/co-applicant/documents/${coApplicantId}/upload`, formData);
    }, {
        onMutate: () => {
            dispatch(setLoading(true));
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['coApplicants']);
            dispatch(setLoading(false));
            dispatch(clearError());
            showSuccess('Document uploaded successfully!');
        },
        onError: (error) => {
            const message = error?.message || 'Failed to upload document';
            dispatch(setError(message));
            dispatch(setLoading(false));
            showError(message);
        },
    });
};

export const useReuploadCoApplicantDocument = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation(({ coApplicantId, documentType, file }) => {
        const formData = new FormData();
        formData.append('file', file);
        return apiPost(
            `/co-applicant/documents/${coApplicantId}/${documentType}/reupload`,
            formData,
        );
    }, {
        onMutate: () => {
            dispatch(setLoading(true));
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['coApplicants']);
            dispatch(setLoading(false));
            dispatch(clearError());
            showSuccess('Document re-uploaded successfully!');
        },
        onError: (error) => {
            const message = error?.message || 'Failed to re-upload document';
            dispatch(setError(message));
            dispatch(setLoading(false));
            showError(message);
        },
    });
};