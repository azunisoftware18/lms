import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { apiGet, apiPost, apiPatch } from "../lib/api/apiClient";
import { showSuccess, showError } from "../lib/utils/toastService";import { normalizeParams } from '../lib/utils/paramHelper';import {
  setLoading,
  setError,
  clearError,
  setLoanApplications,
  setLoanApplication,
  addLoanApplication,
  updateLoanApplicationInList,
} from "../store/slices/loanApplicationSlice";

export const useLoanApplications = (params = {}) => {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.loanApplication?.loading);
  const error = useSelector(state => state.loanApplication?.error);

  const normalizedParams = normalizeParams(params);

  return useQuery({
    queryKey: ["loanApplications", normalizedParams],
    queryFn: () =>
      apiGet('/loan-applications', {
        params: normalizedParams,
      }),
    keepPreviousData: true, 
    onSuccess: (data) => {
      dispatch(setLoanApplications(data));
    },
    onError: (err) => {
      const message = err?.message || "Failed to fetch loan applications";
      dispatch(setError(message));
      showError(message);
    },
  });
};

export const useLoanApplication = (id) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["loanApplication", id],
    queryFn: () => apiGet(`/loan-applications/${id}`),
    enabled: !!id,
    onSuccess: (data) => {
      dispatch(setLoanApplication(data));
    },
    onError: (err) => {
      const message = err?.message || "Failed to fetch loan application";
      dispatch(setError(message));
      showError(message);
    },
  });
};

export const useCreateLoanApplication = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (payload) => apiPost('/loan-applications', payload),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(addLoanApplication(data));
      qc.invalidateQueries(["loanApplications"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Loan application created successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to create loan application";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useUpdateLoanStatus = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ id, status }) => apiPatch(`/loan-applications/${id}/status`, { status }),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(updateLoanApplicationInList(data));
      qc.invalidateQueries(["loanApplications"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Loan status updated successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to update loan status";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useApproveLoan = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (id) => apiPost(`/loan-applications/${id}/approve`),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(updateLoanApplicationInList(data));
      qc.invalidateQueries(["loanApplications"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Loan approved successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to approve loan";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useRejectLoan = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ id, reason }) => apiPost(`/loan-applications/${id}/reject`, { reason }),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(updateLoanApplicationInList(data));
      qc.invalidateQueries(["loanApplications"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Loan rejected successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to reject loan";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useUploadDocuments = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ id, file }) => {
      const formData = new FormData();
      formData.append('file', file);
      return apiPost(`/loan-applications/${id}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      qc.invalidateQueries(["loanApplication"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Documents uploaded successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to upload documents";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useVerifyDocument = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (documentId) =>
      apiPost(`/loan-applications/documents/${documentId}/verify`),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      qc.invalidateQueries(["loanApplication"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Document verified successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to verify document";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useRejectDocument = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ applicationId, documentId, reason }) =>
      apiPost(`/loan-applications/${applicationId}/documents/${documentId}/reject`, {
        reason,
      }),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      qc.invalidateQueries(["loanApplication"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Document rejected successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to reject document";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};