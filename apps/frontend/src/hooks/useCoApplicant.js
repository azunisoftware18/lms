import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { showSuccess, showError } from '../lib/utils/toastService';
import {
    setCoApplicants,
    setLoading,
    setError,
    addCoApplicant,
    updateCoApplicantInList,
    removeCoApplicantFromList,
    clearError,
} from '../store/slices/coApplicationSlice';
import {
    uploadCoApplicantDocument,
    reuploadCoApplicantDocument,
    getCoApplicants,
    getCoApplicantById,
    createCoApplicant,
    updateCoApplicant,
    deleteCoApplicant
} from '../lib/api/coApplicant.api';

export const useCoApplicants = (loanApplicationId) => {
    const dispatch = useDispatch();
    const coApplicants = useSelector(state => state.coApplication.coApplicants);
    const loading = useSelector(state => state.coApplication.loading);
    const error = useSelector(state => state.coApplication.error);

    const query = useQuery(
        ['coApplicants', loanApplicationId],
        () => getCoApplicants(loanApplicationId),
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
        () => getCoApplicantById(id),
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

    return useMutation(createCoApplicant, {
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
        ({ id, data }) => updateCoApplicant(id, data),
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

    return useMutation(deleteCoApplicant, {
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

    return useMutation(uploadCoApplicantDocument, {
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

    return useMutation(reuploadCoApplicantDocument, {
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