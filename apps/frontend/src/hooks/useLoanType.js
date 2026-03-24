import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { apiGet, apiPost, apiPut, apiDelete } from "../lib/api/apiClient";
import { showSuccess, showError } from "../lib/utils/toastService";
import { normalizeParams } from '../lib/utils/paramHelper';
import {
  setLoanTypes,
  setLoading,
  setError,
  clearError,
  addLoanType,
  updateLoanTypeInList,
  removeLoanTypeFromList,
} from "../store/slices/loanTypeSlice";

// Helper to extract loan types from API response
// Backend response format: { success: true, data: { data: [...], meta: {...} } }
const extractLoanTypes = (response) => {
  // Handle different response formats
  if (!response) return [];
  
  // Format: { success: true, data: { data: [...], meta: {...} } }
  if (response?.data && typeof response.data === 'object' && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  
  // Format: { data: [...] }
  if (Array.isArray(response?.data)) {
    return response.data;
  }
  
  // Format: [...]
  if (Array.isArray(response)) {
    return response;
  }
  
  // Format: { items: [...] }
  if (Array.isArray(response?.items)) {
    return response.items;
  }
  
  console.warn('Unexpected API response format:', response);
  return [];
};

export const useLoanTypes = (params = {}) => {
  const dispatch = useDispatch();
  const loanTypesFromStore = useSelector((state) => state.loanTypes.loanTypes);
  const loading = useSelector((state) => state.loanTypes.loading);
  const error = useSelector((state) => state.loanTypes.error);

  const normalizedParams = normalizeParams(params);

  const query = useQuery({
    queryKey: ["loanTypes", normalizedParams],
    queryFn: () => apiGet("/loantypes", { params: normalizedParams }),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!query.data) return;
    const normalizedLoanTypes = extractLoanTypes(query.data);
    dispatch(setLoanTypes(normalizedLoanTypes));
    dispatch(clearError());
  }, [query.data, dispatch]);

  useEffect(() => {
    if (!query.error) return;
    const message = query.error?.message || "Failed to fetch loan types";
    dispatch(setError(message));
    showError(message);
  }, [query.error, dispatch]);

  const fallbackLoanTypes = extractLoanTypes(query.data);
  const normalizedLoanTypes =
    Array.isArray(loanTypesFromStore) && loanTypesFromStore.length > 0
      ? loanTypesFromStore
      : fallbackLoanTypes;

  return {
    loanTypes: normalizedLoanTypes,
    loading: query.isPending || loading,
    error: error || query.error,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};

export const useCreateLoanType = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (payload) => apiPost("/loantypes", payload),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(addLoanType(data));
      dispatch(setLoading(false));
      dispatch(clearError());
      queryClient.invalidateQueries({ queryKey: ["loanTypes"] });
      showSuccess("Loan type created successfully!");
    },
    onError: (mutationError) => {
      const message = mutationError?.message || "Failed to create loan type";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useUpdateLoanType = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ id, data }) => apiPut(`/loantypes/${id}`, data),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(updateLoanTypeInList(data));
      dispatch(setLoading(false));
      dispatch(clearError());
      queryClient.invalidateQueries({ queryKey: ["loanTypes"] });
      showSuccess("Loan type updated successfully!");
    },
    onError: (mutationError) => {
      const message = mutationError?.message || "Failed to update loan type";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useDeleteLoanType = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (id) => apiDelete(`/loantypes/${id}`),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (_, id) => {
      dispatch(removeLoanTypeFromList(id));
      dispatch(setLoading(false));
      dispatch(clearError());
      queryClient.invalidateQueries({ queryKey: ["loanTypes"] });
      showSuccess("Loan type deleted successfully!");
    },
    onError: (mutationError) => {
      const message = mutationError?.message || "Failed to delete loan type";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};
