import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { apiGet, apiPost, apiPatch } from "../lib/api/apiClient";
import { showSuccess, showError } from "../lib/utils/toastService";
import {
  setLeads,
  setLoading,
  setError,
  addLead,
  updateLeadInList,
  removeLeadFromList,
  clearError,
} from "../store/slices/leadSlice";

const getLeads = (params = {}) => apiGet("/lead/all", { params });
const createLead = (payload) => apiPost("/lead", payload);
const updateLeadStatus = ({ id, status }) =>
  apiPatch(`/lead/update-status/${id}`, { status });
const assignLead = ({ id, payload }) =>
  apiPatch(`/lead/assign/${id}`, payload);
const convertLeadToLoan = (id) => apiGet(`/lead/convert-to-loan/${id}`);

export const useLead = (params) => {
  const dispatch = useDispatch();
  const leadsFromStore = useSelector((state) => state?.lead?.leads || []);
  const loading = useSelector((state) => state?.lead?.loading || false);
  const error = useSelector((state) => state?.lead?.error || null);

  const query = useQuery({
    queryKey: ["leads", params],
    queryFn: () => getLeads(params),
    onSuccess: (data) => {
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.items)
            ? data.items
            : [];

      dispatch(setLeads(list));
      dispatch(clearError());
    },
    onError: (queryError) => {
      const message = queryError?.message || "Failed to fetch leads";
      dispatch(setError(message));
      showError(message);
    },
    staleTime: 1000 * 60 * 5,
  });

  const normalizedLeads = {
    data: leadsFromStore,
    total:
      query.data?.total ||
      query.data?.meta?.total ||
      query.data?.pagination?.total ||
      leadsFromStore.length,
  };

  return {
    leads: normalizedLeads,
    loading: query.isLoading || loading,
    error: error || query.error,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: createLead,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(addLead(data));
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Lead created successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to create lead";
      dispatch(setLoading(false));
      dispatch(setError(message));
      showError(message);
    },
  });
};

export const useUpdateLeadStatus = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: updateLeadStatus,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(updateLeadInList(data));
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Lead status updated successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to update lead status";
      dispatch(setLoading(false));
      dispatch(setError(message));
      showError(message);
    },
  });
};

export const useAssignLead = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: assignLead,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(updateLeadInList(data));
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Lead assigned successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to assign lead";
      dispatch(setLoading(false));
      dispatch(setError(message));
      showError(message);
    },
  });
};

export const useConvertLeadToLoan = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: convertLeadToLoan,
    onMutate: () => {
      dispatch(setLoading(true));
    },

    onSuccess: (data) => {
      dispatch(removeLeadFromList(data?.id));
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Lead converted to loan successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to convert lead to loan";
      dispatch(setLoading(false));
      dispatch(setError(message));
      showError(message);
    },
  });
};
