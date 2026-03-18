import {useQuery,useMutation,useQueryClient} from '@tanstack/react-query';


import { useDispatch, useSelector } from 'react-redux';
import { showSuccess, showError } from '../lib/utils/toastService';
import {
    setLeads,
    setLoading,
    setError,
    addLead,
    updateLeadInList,
    removeLeadFromList,
    clearError,
} from '../store/slices/leadSlice';

import{
    getLeads,
    createLead,
    updateLeadStatus,
    assignLead,
    convertLeadToLoan
} from '../lib/api/lead.api';



export const useLead = (params)=>{
const dispatch = useDispatch();
const leads = useSelector(state => state.lead.leads);
const loading = useSelector(state => state.lead.loading);
const error = useSelector(state => state.lead.error);


const query = useQuery(['leads', params], () => getLeads(params), { 
    onSuccess: (data) => {
        dispatch(setLeads(data));
        dispatch(clearError());
    },
    onError: (queryError) => {
        const message = queryError?.message || 'Failed to fetch leads';
        dispatch(setError(message));
        showError(message);
    },
    staleTime: 1000 * 60 * 5,
});
return {
    leads,
    loading: query.isLoading || loading,
    error: error || query.error,
    isFetching: query.isFetching,
    refetch: query.refetch,
};
}


export const useCreateLead = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    return useMutation(createLead, {
        onMutate: () => {
            dispatch(setLoading(true));
        },
        onSuccess: (data) => {
            dispatch(addLead(data));
            queryClient.invalidateQueries(['leads']);
            dispatch(setLoading(false));
            dispatch(clearError());
            showSuccess('Lead created successfully!');
        },
        onError: (error) => {
            const message = error?.message || 'Failed to create lead';
            dispatch(setLoading(false));
            dispatch(setError(message));
            showError(message);
        },
    });
};

export const useUpdateLeadStatus = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    return useMutation(updateLeadStatus, {
        onMutate: () => {
            dispatch(setLoading(true));
        },
        onSuccess: (data) => {
            dispatch(updateLeadInList(data));
            queryClient.invalidateQueries(['leads']);
            dispatch(setLoading(false));
            dispatch(clearError());
            showSuccess('Lead status updated successfully!');
        },
        onError: (error) => {
            const message = error?.message || 'Failed to update lead status';
            dispatch(setLoading(false));
            dispatch(setError(message));
            showError(message);
        },
    });
};


export const useAssignLead = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    return useMutation(assignLead, {
        onMutate: () => {
            dispatch(setLoading(true));
        },
        onSuccess: (data) => {
            dispatch(updateLeadInList(data));
            queryClient.invalidateQueries(['leads']);
            dispatch(setLoading(false));
            dispatch(clearError());
            showSuccess('Lead assigned successfully!');
        },
        onError: (error) => {
            const message = error?.message || 'Failed to assign lead';
            dispatch(setLoading(false));
            dispatch(setError(message));
            showError(message);
        }

    });
};

export const useConvertLeadToLoan = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    return useMutation(convertLeadToLoan, {
        onMutate: () => {
            dispatch(setLoading(true));
        },

        onSuccess: (data) => {
            dispatch(removeLeadFromList(data.id));
            queryClient.invalidateQueries(['leads']);
            dispatch(setLoading(false));
            dispatch(clearError());
            showSuccess('Lead converted to loan successfully!');
        },
        onError: (error) => {
            const message = error?.message || 'Failed to convert lead to loan';
            dispatch(setLoading(false));
            dispatch(setError(message));
            showError(message);
        }
    });
};

