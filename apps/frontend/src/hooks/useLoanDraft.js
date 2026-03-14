import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { showError, showSuccess } from "../lib/utils/toastService";
import {
  createLoanDraft,
  getLoanDraftById,
  submitLoanDraft,
  updateLoanDraft,
} from "../lib/api/loanDraft.api";
import {
  clearError,
  setDraft,
  setError,
  setLoading,
  setSubmittedResult,
} from "../store/slices/loanDraftSlice";

export const useLoanDraft = (id) => {
  const dispatch = useDispatch();
  const draft = useSelector((state) => state.loanDraft?.draft);
  const loading = useSelector((state) => state.loanDraft?.loading);
  const error = useSelector((state) => state.loanDraft?.error);

  const query = useQuery({
    queryKey: ["loanDraft", id],
    queryFn: () => getLoanDraftById(id),
    enabled: !!id,
    onSuccess: (data) => {
      dispatch(setDraft(data));
      dispatch(clearError());
    },
    onError: (queryError) => {
      const message = queryError?.message || "Failed to fetch loan draft";
      dispatch(setError(message));
      showError(message);
    },
  });

  return {
    draft,
    loading: query.isLoading || loading,
    error: error || query.error,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};

export const useCreateLoanDraft = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLoanDraft,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(setDraft(data));
      dispatch(clearError());
      queryClient.invalidateQueries({ queryKey: ["loanDraft"] });
      showSuccess("Loan draft created successfully");
    },
    onError: (mutationError) => {
      const message = mutationError?.message || "Failed to create loan draft";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useUpdateLoanDraft = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLoanDraft,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data, variables) => {
      dispatch(setDraft(data));
      dispatch(clearError());
      queryClient.invalidateQueries({ queryKey: ["loanDraft", variables?.id] });
      showSuccess("Loan draft updated successfully");
    },
    onError: (mutationError) => {
      const message = mutationError?.message || "Failed to update loan draft";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useSubmitLoanDraft = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitLoanDraft,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data, draftId) => {
      dispatch(setSubmittedResult(data));
      dispatch(clearError());
      queryClient.invalidateQueries({ queryKey: ["loanDraft", draftId] });
      queryClient.invalidateQueries({ queryKey: ["loanApplications"] });
      showSuccess("Loan draft submitted successfully");
    },
    onError: (mutationError) => {
      const message = mutationError?.message || "Failed to submit loan draft";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};
