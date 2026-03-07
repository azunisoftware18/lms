import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { showSuccess, showError } from '../lib/utils/toastService';
import {
    setBranchAdmins,
    setLoading,
    setError,
    addBranchAdmin,
    updateBranchAdminInList,
    removeBranchAdminFromList,
    clearError,
} from '../store/slices/branchAdminSlice';
import {
    getBranchAdmins,
    createBranchAdmin,
    getBranchAdminById,
    updateBranchAdmins,
    deleteBranchAdmin
} from '../lib/api/branchAdmin.api';

export const useCreateBranchAdmin = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation(createBranchAdmin, {
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
        ({ id, data }) => updateBranchAdmins(id, data),
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

    return useMutation(deleteBranchAdmin, {
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

export const useBranchAdmins = () => {
    const dispatch = useDispatch();
    const branchAdmins = useSelector(state => state.branchAdmin.branchAdmins);
    const loading = useSelector(state => state.branchAdmin.loading);
    const error = useSelector(state => state.branchAdmin.error);

    const query = useQuery(['branchAdmins'], getBranchAdmins, {
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
        () => getBranchAdminById(id),
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
   