import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { apiGet, apiPost, apiPut, apiDelete } from "../lib/api/apiClient";
import { showSuccess, showError } from "../lib/utils/toastService";import { normalizeParams } from '../lib/utils/paramHelper';import {
  setLoanTypes,
  setLoading,
  setError,
  clearError,
  addLoanType,
  updateLoanTypeInList,
  removeLoanTypeFromList,
} from "../store/slices/loanTypeSlice";
export const useLoanTypes = (params = {}) => {
  const dispatch = useDispatch();
  const loanTypes = useSelector((state) => state.loanTypes.loanTypes);
  const loading = useSelector((state) => state.loanTypes.loading);
  const error = useSelector((state) => state.loanTypes.error);

  const normalizedParams = normalizeParams(params);

  const query = useQuery({
    queryKey: ["loanTypes", normalizedParams],
    queryFn: () => apiGet("/loantypes", { params: normalizedParams }),
    onSuccess: (data) => {
      const normalizedLoanTypes = Array.isArray(data) ? data : data?.data || [];
      dispatch(setLoanTypes(normalizedLoanTypes));
      dispatch(clearError());
    },
    onError: (queryError) => {
      const message = queryError?.message || "Failed to fetch loan types";
      dispatch(setError(message));
      showError(message);
    },
    staleTime: 1000 * 60 * 5,
  });

  return {
    loanTypes,
    loading: query.isLoading || loading,
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
