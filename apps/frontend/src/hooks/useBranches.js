import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { showSuccess, showError, dismissToast } from '../lib/utils/toastService';
import {
    setBranches,
    setMainBranches,
    setLoading,
    setError,
    addBranch,
    updateBranchInList,
    removeBranchFromList,
    clearError,
} from '../store/slices/branchSlice';
import {
    getBranches,
    createbranch,
    getBranchById,
    updateBranch,
    deleteBranch,
    getMainBranches
} from '../lib/api/branch.api';

export const useCreateBranch = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation(createbranch, {
        onMutate: () => {
            dispatch(setLoading(true));
        },
        onSuccess: (data) => {
            dispatch(addBranch(data));
            queryClient.invalidateQueries(['branches']);
            dispatch(setLoading(false));
            dispatch(clearError());
            showSuccess('Branch created successfully!');
        },
        onError: (error) => {
            const message = error?.message || 'Failed to create branch';
            dispatch(setError(message));
            dispatch(setLoading(false));
            showError(message);
        },
    });
};

export const useUpdateBranch = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation(
        ({ id, branchData }) => updateBranch(id, branchData),
        {
            onMutate: () => {
                dispatch(setLoading(true));
            },
            onSuccess: (data) => {
                dispatch(updateBranchInList(data));
                queryClient.invalidateQueries(['branches']);
                dispatch(setLoading(false));
                dispatch(clearError());
                showSuccess('Branch updated successfully!');
            },
            onError: (error) => {
                const message = error?.message || 'Failed to update branch';
                dispatch(setError(message));
                dispatch(setLoading(false));
                showError(message);
            },
        }
    );
};

export const useDeleteBranch = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation(deleteBranch, {
        onMutate: () => {
            dispatch(setLoading(true));
        },
        onSuccess: (data, variables) => {
            dispatch(removeBranchFromList(variables));
            queryClient.invalidateQueries(['branches']);
            dispatch(setLoading(false));
            dispatch(clearError());
            showSuccess('Branch deleted successfully!');
        },
        onError: (error) => {
            const message = error?.message || 'Failed to delete branch';
            dispatch(setError(message));
            dispatch(setLoading(false));
            showError(message);
        },
    });
};

export const useBranches = () => {
    const dispatch = useDispatch();
    const branches = useSelector(state => state.branch.branches);
    const loading = useSelector(state => state.branch.loading);
    const error = useSelector(state => state.branch.error);

    const query = useQuery(['branches'], getBranches, {
        onSuccess: (data) => {
            dispatch(setBranches(data));
            dispatch(clearError());
        },
        onError: (error) => {
            const message = error?.message || 'Failed to fetch branches';
            dispatch(setError(message));
            showError(message);
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return {
        branches,
        loading: query.isLoading || loading,
        error: error || query.error,
        isFetching: query.isFetching,
        refetch: query.refetch,
    };
};

export const useBranchById = (id) => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    return useQuery(
        ['branch', id],
        () => getBranchById(id),
        {
            enabled: !!id,
            onSuccess: (data) => {
                dispatch(clearError());
            },
            onError: (error) => {
                const message = error?.message || `Failed to fetch branch`;
                dispatch(setError(message));
                showError(message);
            },
            staleTime: 1000 * 60 * 5,
        }
    );
};

export const useMainBranches = () => {
    const dispatch = useDispatch();
    const mainBranches = useSelector(state => state.branch.mainBranches);
    const loading = useSelector(state => state.branch.loading);
    const error = useSelector(state => state.branch.error);

    const query = useQuery(['mainBranches'], getMainBranches, {
        onSuccess: (data) => {
            dispatch(setMainBranches(data));
            dispatch(clearError());
        },
        onError: (error) => {
            const message = error?.message || 'Failed to fetch main branches';
            dispatch(setError(message));
            showError(message);
        },
        staleTime: 1000 * 60 * 5,
    });

    return {
        mainBranches,
        loading: query.isLoading || loading,
        error: error || query.error,
        isFetching: query.isFetching,
        refetch: query.refetch,
    };
};
