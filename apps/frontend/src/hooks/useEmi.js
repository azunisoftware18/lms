import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { showSuccess, showError } from '../lib/utils/toastService';
import {
    setEmis,
    setEmiSchedule,
    setPayableAmount,
    setCalculatedEmi,
    setLoading,
    setError,
    updateEmiInList,
    clearError,
} from '../store/slices/emiSlice';
import {
    getAllEmis,
    generateEmiSchedule,
    getLoanEmis,
    payEmi,
    getEmiPayableAmount,
    calculateEmi,
    forecloseLoan,
    applyMoratorium
} from '../lib/api/emi.api';

export const useAllEmis = (params) => {
    const dispatch = useDispatch();
    const emis = useSelector(state => state.emi.emis);
    const meta = useSelector(state => state.emi.meta);
    const loading = useSelector(state => state.emi.loading);
    const error = useSelector(state => state.emi.error);

    const { isFetching, refetch } = useQuery({
        queryKey: ['allEmis', params],
        queryFn: () => getAllEmis(params),
        keepPreviousData: true,
        onSuccess: (data) => {
            dispatch(setEmis(data));
            dispatch(clearError());
        },
        onError: (error) => {
            const message = error?.message || 'Failed to fetch EMIs';
            dispatch(setError(message));
            showError(message);
        },
    });

    return { emis, meta, loading, error, isFetching, refetch };
};

export const useLoanEmis = (loanId) => {
    const dispatch = useDispatch();
    const emis = useSelector(state => state.emi.emis);
    const loading = useSelector(state => state.emi.loading);
    const error = useSelector(state => state.emi.error);

    const query = useQuery(
        ['emis', loanId],
        () => getLoanEmis(loanId),
        {
            enabled: !!loanId,
            onSuccess: (data) => {
                dispatch(setEmis(data));
                dispatch(clearError());
            },
            onError: (error) => {
                const message = error?.message || 'Failed to fetch EMIs';
                dispatch(setError(message));
                showError(message);
            },
            staleTime: 1000 * 60 * 5, // 5 minutes
        }
    );

    return {
        emis,
        loading: query.isLoading || loading,
        error: error || query.error,
        isFetching: query.isFetching,
        refetch: query.refetch,
    };
};

export const useGenerateSchedule = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation(generateEmiSchedule, {
        onMutate: () => {
            dispatch(setLoading(true));
        },
        onSuccess: (data) => {
            dispatch(setEmiSchedule(data));
            queryClient.invalidateQueries(['emis']);
            dispatch(setLoading(false));
            dispatch(clearError());
            showSuccess('EMI schedule generated successfully!');
        },
        onError: (error) => {
            const message = error?.message || 'Failed to generate EMI schedule';
            dispatch(setError(message));
            dispatch(setLoading(false));
            showError(message);
        },
    });
};

export const usePayEmi = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation(payEmi, {
        onMutate: () => {
            dispatch(setLoading(true));
        },
        onSuccess: (data) => {
            dispatch(updateEmiInList(data));
            queryClient.invalidateQueries(['emis']);
            dispatch(setLoading(false));
            dispatch(clearError());
            showSuccess('EMI payment successful!');
        },
        onError: (error) => {
            const message = error?.message || 'Failed to process EMI payment';
            dispatch(setError(message));
            dispatch(setLoading(false));
            showError(message);
        },
    });
};

export const useCalculateEmi = () => {
    const dispatch = useDispatch();

    return useMutation(calculateEmi, {
        onMutate: () => {
            dispatch(setLoading(true));
        },
        onSuccess: (data) => {
            dispatch(setCalculatedEmi(data));
            dispatch(setLoading(false));
            dispatch(clearError());
        },
        onError: (error) => {
            const message = error?.message || 'Failed to calculate EMI';
            dispatch(setError(message));
            dispatch(setLoading(false));
            showError(message);
        },
    });
};

export const useEmiPayableAmount = (emiId) => {
    const dispatch = useDispatch();

    return useQuery(
        ['emiPayable', emiId],
        () => getEmiPayableAmount(emiId),
        {
            enabled: !!emiId,
            onSuccess: (data) => {
                dispatch(setPayableAmount(data));
                dispatch(clearError());
            },
            onError: (error) => {
                const message = error?.message || 'Failed to fetch payable amount';
                dispatch(setError(message));
                showError(message);
            },
            staleTime: 1000 * 60 * 1, // 1 minute (more frequent for payment amounts)
        }
    );
};

export const useApplyMoratorium = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation(applyMoratorium, {
        onMutate: () => {
            dispatch(setLoading(true));
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['emis']);
            dispatch(setLoading(false));
            dispatch(clearError());
            showSuccess('Moratorium applied successfully!');
        },
        onError: (error) => {
            const message = error?.message || 'Failed to apply moratorium';
            dispatch(setError(message));
            dispatch(setLoading(false));
            showError(message);
        },
    });
};

export const useForecloseLoan = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation(forecloseLoan, {
        onMutate: () => {
            dispatch(setLoading(true));
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['emis']);
            dispatch(setLoading(false));
            dispatch(clearError());
            showSuccess('Loan foreclosed successfully!');
        },
        onError: (error) => {
            const message = error?.message || 'Failed to foreclose loan';
            dispatch(setError(message));
            dispatch(setLoading(false));
            showError(message);
        },
    });
};