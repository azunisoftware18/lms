import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { apiGet, apiPost, apiPut, apiDelete } from '../lib/api/apiClient';
import { showSuccess, showError } from '../lib/utils/toastService';
import { normalizeParams } from '../lib/utils/paramHelper';
import {
    setBranchAdmins,
    setLoading,
    setError,
    addBranchAdmin,
    updateBranchAdminInList,
    removeBranchAdminFromList,
    clearError,
} from '../store/slices/branchAdminSlice';
export const useCreateBranchAdmin = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation((payload) => apiPost('/branch-admin', payload), {
        onMutate: () => {
            dispatch(setLoading(true));
        },
        onSuccess: (data) => {
            dispatch(addBranchAdmin(data));
            queryClient.invalidateQueries(['branchAdmins']);
            dispatch(setLoading(false));
            dispatch(clearError());
            showSuccess('Branch admin created successfully!');
        },
        onError: (error) => {
            const message = error?.message || 'Failed to create branch admin';
            dispatch(setError(message));
            dispatch(setLoading(false));
            showError(message);
        },
    });
};

export const useUpdateBranchAdmin = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation(
        ({ id, data }) => apiPut(`/branch-admin/${id}`, data),
        {
            onMutate: () => {
                dispatch(setLoading(true));
            },
            onSuccess: (data) => {
                dispatch(updateBranchAdminInList(data));
                queryClient.invalidateQueries(['branchAdmins']);
                dispatch(setLoading(false));
                dispatch(clearError());
                showSuccess('Branch admin updated successfully!');
            },
            onError: (error) => {
                const message = error?.message || 'Failed to update branch admin';
                dispatch(setError(message));
                dispatch(setLoading(false));
                showError(message);
            },
        }
    );
};

export const useDeleteBranchAdmin = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation((id) => apiDelete(`/branch-admin/${id}`), {
        onMutate: () => {
            dispatch(setLoading(true));
        },
        onSuccess: (data, variables) => {
            dispatch(removeBranchAdminFromList(variables));
            queryClient.invalidateQueries(['branchAdmins']);
            dispatch(setLoading(false));
            dispatch(clearError());
            showSuccess('Branch admin deleted successfully!');
        },
        onError: (error) => {
            const message = error?.message || 'Failed to delete branch admin';
            dispatch(setError(message));
            dispatch(setLoading(false));
            showError(message);
        },
    });
};

export const useBranchAdmins = (params = {}) => {
    const dispatch = useDispatch();
    const branchAdmins = useSelector(state => state.branchAdmin.branchAdmins);
    const loading = useSelector(state => state.branchAdmin.loading);
    const error = useSelector(state => state.branchAdmin.error);

    const normalizedParams = normalizeParams(params);

    const query = useQuery(['branchAdmins', normalizedParams], () => apiGet('/branch-admin', { params: normalizedParams }), {
        onSuccess: (data) => {
            dispatch(setBranchAdmins(data));
            dispatch(clearError());
        },
        onError: (error) => {
            const message = error?.message || 'Failed to fetch branch admins';
            dispatch(setError(message));
            showError(message);
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return {
        branchAdmins,
        loading: query.isLoading || loading,
        error: error || query.error,
        isFetching: query.isFetching,
        refetch: query.refetch,
    };
};

export const useBranchAdminById = (id) => {
    const dispatch = useDispatch();

    return useQuery(
        ['branchAdmin', id],
        () => apiGet(`/branch-admin/${id}`),
        {
            enabled: !!id,
            onSuccess: (data) => {
                dispatch(clearError());
            },
            onError: (error) => {
                const message = error?.message || `Failed to fetch branch admin`;
                dispatch(setError(message));
                showError(message);
            },
            staleTime: 1000 * 60 * 5,
        }
    );
};
   