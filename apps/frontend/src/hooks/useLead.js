import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { apiGet, apiPost, apiPatch } from "../lib/api/apiClient";
import { showSuccess, showError } from "../lib/utils/toastService";
import { normalizeParams } from "../lib/utils/paramHelper";
import {
    setLeads,
    setLoading,
    setError,
    addLead,
    updateLeadInList,
    removeLeadFromList,
    clearError,
} from "../store/slices/leadSlice";



export const useLead = (params = {}) => {
    const dispatch = useDispatch();
    const leads = useSelector((state) => state.lead.leads);
    const loading = useSelector((state) => state.lead.loading);
    const error = useSelector((state) => state.lead.error);

    const normalizedParams = {
        ...normalizeParams(params),
        status: params?.status,
    };

    const query = useQuery(["leads", normalizedParams], () => apiGet("/leads", { params: normalizedParams }), {
        onSuccess: (data) => {
            dispatch(setLeads(data));
            dispatch(clearError());
        },
        onError: (queryError) => {
            const message = queryError?.message || "Failed to fetch leads";
            dispatch(setError(message));
            showError(message);
        },
        staleTime: 1000 * 60 * 5,
    });

    return {
        leads: query.data ?? leads,
        loading: query.isLoading || loading,
        error: error || query.error,
        isFetching: query.isFetching,
        refetch: query.refetch,
    };};


export const useCreateLead = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation((payload) => apiPost("/leads", payload), {
        onMutate: () => {
            dispatch(setLoading(true));
        },
        onSuccess: (data) => {
            dispatch(addLead(data));
            queryClient.invalidateQueries(["leads"]);
            dispatch(setLoading(false));
            dispatch(clearError());
            showSuccess("Lead created successfully!");
        },
        onError: (queryError) => {
            const message = queryError?.message || "Failed to create lead";
            dispatch(setLoading(false));
            dispatch(setError(message));
            showError(message);
        },
    });
};

export const useUpdateLeadStatus = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation(
        ({ id, status }) => apiPatch(`/leads/${id}/status`, { status }),
        {
            onMutate: () => {
                dispatch(setLoading(true));
            },
            onSuccess: (data) => {
                dispatch(updateLeadInList(data));
                queryClient.invalidateQueries(["leads"]);
                dispatch(setLoading(false));
                dispatch(clearError());
                showSuccess("Lead status updated successfully!");
            },
            onError: (queryError) => {
                const message = queryError?.message || "Failed to update lead status";
                dispatch(setLoading(false));
                dispatch(setError(message));
                showError(message);
            },
        },
    );
};


export const useAssignLead = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation(
        ({ id, assignedTo }) => apiPatch(`/leads/${id}/assign`, { assignedTo }),
        {
            onMutate: () => {
                dispatch(setLoading(true));
            },
            onSuccess: (data) => {
                dispatch(updateLeadInList(data));
                queryClient.invalidateQueries(["leads"]);
                dispatch(setLoading(false));
                dispatch(clearError());
                showSuccess("Lead assigned successfully!");
            },
            onError: (queryError) => {
                const message = queryError?.message || "Failed to assign lead";
                dispatch(setLoading(false));
                dispatch(setError(message));
                showError(message);
            },
        },
    );
};

export const useConvertLeadToLoan = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation((id) => apiPost(`/leads/${id}/convert`), {
        onMutate: () => {
            dispatch(setLoading(true));
        },
        onSuccess: (data) => {
            if (data?.id) {
                dispatch(removeLeadFromList(data.id));
            }
            queryClient.invalidateQueries(["leads"]);      
            dispatch(setLoading(false));
            dispatch(clearError());
            showSuccess("Lead converted to loan successfully!");
        },
        onError: (queryError) => {
            const message = queryError?.message || "Failed to convert lead to loan";
            dispatch(setLoading(false));
            dispatch(setError(message));
            showError(message);
        },
    });
};

