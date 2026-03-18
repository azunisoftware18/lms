import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { apiGet, apiPost } from "../lib/api/apiClient";
import { showSuccess, showError } from "../lib/utils/toastService";
import { normalizeParams } from "../lib/utils/paramHelper";
import {
  setLoading,
  setError,
  clearError,
  setTechnicalReports,
  addTechnicalReport,
  updateTechnicalReportInList,
} from "../store/slices/technicalReportSlice";

export const useTechnicalReports = (params = {}) => {
  const dispatch = useDispatch();
  const normalizedParams = normalizeParams(params);

  return useQuery({
    queryKey: ["technicalReports", normalizedParams],
    queryFn: () => apiGet("/technical-reports", { params: normalizedParams }),
    onSuccess: (data) => {
      dispatch(setTechnicalReports(data));
      dispatch(clearError());
    },
    onError: (err) => {
      const message = err?.message || "Failed to fetch technical reports";
      dispatch(setError(message));
      showError(message);
    },
  });
};

export const useCreateTechnicalReport = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ loanId, data }) =>
      apiPost(`/loan-applications/${loanId}/technical-reports`, data),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(addTechnicalReport(data));
      queryClient.invalidateQueries(["technicalReports"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Technical report created successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to create technical report";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useApproveTechnicalReport = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (reportId) => apiPost(`/technical-reports/${reportId}/approve`),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(updateTechnicalReportInList(data));
      queryClient.invalidateQueries(["technicalReports"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Technical report approved successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to approve technical report";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};