import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { apiGet, apiPost, apiPatch } from "../lib/api/apiClient";
import { showError, showSuccess } from "../lib/utils/toastService";
import {
  clearError,
  setDraft,
  setError,
  setLoading,
  setSubmittedResult,
  clearDraft,
} from "../store/slices/loanDraftSlice";

export const useCreateLoanDraft = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiPost("/loan-drafts"),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(setLoading(false));
      dispatch(setDraft(data?.data ?? data));
      dispatch(clearError());
      queryClient.invalidateQueries({ queryKey: ["loanDrafts"] });
      showSuccess("Loan draft created successfully");
    },
    onError: (error) => {
      dispatch(setLoading(false));
      const message = error?.message || "Failed to create loan draft";
      dispatch(setError(message));
      showError(message);
    },
  });
};

export const useLoanDraftById = (id) => {
  const dispatch = useDispatch();
  const draft = useSelector((state) => state.loanDraft?.draft);
  const loading = useSelector((state) => state.loanDraft?.loading);
  const error = useSelector((state) => state.loanDraft?.error);

  const query = useQuery({
    queryKey: ["loanDraft", id],
    queryFn: () => apiGet(`/loan-drafts/${id}`),
    enabled: !!id,
    keepPreviousData: true,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    select: (data) => data?.data ?? data,
    onSuccess: () => {
      dispatch(clearError());
    },
    onError: (queryError) => {
      const message = queryError?.message || "Failed to fetch loan draft";
      dispatch(setError(message));
      showError(message);
    },
  });

  return {
    draft: query.data || draft,
    loading: query.isLoading || loading,
    error: error || query.error,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};

export const useUpdateLoanDraft = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => apiPatch(`/loan-drafts/${id}`, payload),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data, variables) => {
      dispatch(setLoading(false));
      dispatch(setDraft(data?.data ?? data));
      dispatch(clearError());
      queryClient.invalidateQueries({ queryKey: ["loanDraft", variables?.id] });
      showSuccess("Loan draft updated successfully");
    },
    onError: (error) => {
      dispatch(setLoading(false));
      const message = error?.message || "Failed to update loan draft";
      dispatch(setError(message));
      showError(message);
    },
  });
};

export const useSubmitLoanDraft = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => apiPost(`/loan-drafts/${id}/submit`),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data, draftId) => {
      dispatch(setLoading(false));
      dispatch(setSubmittedResult(data?.data ?? data));
      dispatch(clearError());
      dispatch(clearDraft());
      queryClient.invalidateQueries({ queryKey: ["loanDraft", draftId] });
      queryClient.invalidateQueries({ queryKey: ["loanApplications"] });
      showSuccess("Loan draft submitted successfully");
    },
    onError: (error) => {
      dispatch(setLoading(false));
      const message = error?.message || "Failed to submit loan draft";
      dispatch(setError(message));
      showError(message);
    },
  });
};
