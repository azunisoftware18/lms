import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { apiGet, apiPost } from "../lib/api/apiClient";
import { showSuccess, showError } from "../lib/utils/toastService";
import { normalizeParams } from "../lib/utils/paramHelper";
import {
  setLoading,
  setError,
  clearError,
  setLegalReports,
  addLegalReport,
  updateLegalReportInList,
} from "../store/slices/legalReportSlice";

export const useLegalReports = (params = {}) => {
  const dispatch = useDispatch();
  const normalizedParams = normalizeParams(params);

  return useQuery({
    queryKey: ["legalReports", normalizedParams],
    queryFn: () => apiGet("/legal-reports", { params: normalizedParams }),
    onSuccess: (data) => {
      dispatch(setLegalReports(data));
      dispatch(clearError());
    },
    onError: (err) => {
      const message = err?.message || "Failed to fetch legal reports";
      dispatch(setError(message));
      showError(message);
    },
  });
};

export const useCreateLegalReport = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ loanId, data }) => apiPost(`/loan/${loanId}/legal-report`, data),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(addLegalReport(data));
      queryClient.invalidateQueries(["legalReports"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Legal report created successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to create legal report";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useApproveLegalReport = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (reportId) => apiPost(`/legal-report/${reportId}/approve`),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(updateLegalReportInList(data));
      queryClient.invalidateQueries(["legalReports"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Legal report approved successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to approve legal report";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};