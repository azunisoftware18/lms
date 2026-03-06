import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { showSuccess, showError } from '../lib/utils/toastService';
import {
    setCreditReports,
    setReportData,
    setLoading,
    setError,
    addCreditReport,
    updateCreditReportInList,
    removeCreditReportFromList,
    clearError,
} from '../store/slices/creditReportSlice';
import {
    refreshCreditReport,
    getCreditReports,
    getCreditReportById,
    createCreditReport,
    deleteCreditReport
} from '../lib/api/creditReport.api';

export const useRefreshCreditReport = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation(refreshCreditReport, {
        onMutate: () => {
            dispatch(setLoading(true));
        },
        onSuccess: (data) => {
            dispatch(setReportData(data));
            queryClient.invalidateQueries(['creditReports']);
            dispatch(setLoading(false));
            dispatch(clearError());
            showSuccess('Credit report refreshed successfully!');
        },
        onError: (error) => {
            const message = error?.message || 'Failed to refresh credit report';
            dispatch(setError(message));
            dispatch(setLoading(false));
            showError(message);
        },
    });
};

export const useCreditReports = (applicantId) => {
    const dispatch = useDispatch();
    const creditReports = useSelector(state => state.creditReport.creditReports);
    const loading = useSelector(state => state.creditReport.loading);
    const error = useSelector(state => state.creditReport.error);

    const query = useQuery(
        ['creditReports', applicantId],
        () => getCreditReports(applicantId),
        {
            enabled: !!applicantId,
            onSuccess: (data) => {
                dispatch(setCreditReports(data));
                dispatch(clearError());
            },
            onError: (error) => {
                const message = error?.message || 'Failed to fetch credit reports';
                dispatch(setError(message));
                showError(message);
            },
            staleTime: 1000 * 60 * 5, // 5 minutes
        }
    );

    return {
        creditReports,
        loading: query.isLoading || loading,
        error: error || query.error,
        isFetching: query.isFetching,
        refetch: query.refetch,
    };
};

export const useCreditReportById = (id) => {
    const dispatch = useDispatch();

    return useQuery(
        ['creditReport', id],
        () => getCreditReportById(id),
        {
            enabled: !!id,
            onSuccess: (data) => {
                dispatch(setReportData(data));
                dispatch(clearError());
            },
            onError: (error) => {
                const message = error?.message || `Failed to fetch credit report`;
                dispatch(setError(message));
                showError(message);
            },
            staleTime: 1000 * 60 * 5,
        }
    );
};

export const useCreateCreditReport = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation(createCreditReport, {
        onMutate: () => {
            dispatch(setLoading(true));
        },
        onSuccess: (data) => {
            dispatch(addCreditReport(data));
            queryClient.invalidateQueries(['creditReports']);
            dispatch(setLoading(false));
            dispatch(clearError());
            showSuccess('Credit report created successfully!');
        },
        onError: (error) => {
            const message = error?.message || 'Failed to create credit report';
            dispatch(setError(message));
            dispatch(setLoading(false));
            showError(message);
        },
    });
};

export const useDeleteCreditReport = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation(deleteCreditReport, {
        onMutate: () => {
            dispatch(setLoading(true));
        },
        onSuccess: (data, variables) => {
            dispatch(removeCreditReportFromList(variables));
            queryClient.invalidateQueries(['creditReports']);
            dispatch(setLoading(false));
            dispatch(clearError());
            showSuccess('Credit report deleted successfully!');
        },
        onError: (error) => {
            const message = error?.message || 'Failed to delete credit report';
            dispatch(setError(message));
            dispatch(setLoading(false));
            showError(message);
        },
    });
};