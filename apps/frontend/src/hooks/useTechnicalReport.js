import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { apiGet, apiPatch, apiPost, apiPut } from "../lib/api/apiClient";
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
    queryFn: () => apiGet("/reports/technical/technical-reports", { params: normalizedParams }),
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
    mutationFn: ({ loanNumber, data }) =>
      apiPost(`/reports/technical/loan-applications/${loanNumber}/technical-reports`, data),
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
      // Prefer structured server validation error payload when available
      const serverData = error?.response?.data || error?.data || null;
      const message =
        serverData?.message || error?.message || "Failed to create technical report";
      // If server returned field-level errors, attach them to the error object
      const fieldErrors = serverData?.errors || serverData?.fieldErrors || null;

      // Attach parsed info to the thrown error so callers can use it
      const enhancedError = new Error(message);
      enhancedError.original = error;
      if (fieldErrors) enhancedError.fieldErrors = fieldErrors;

      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
      // rethrow enhanced error so the component can inspect fieldErrors
      throw enhancedError;
    },
  });
};

export const useApproveTechnicalReport = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    // backend router is mounted at /reports/technical
    mutationFn: (reportId) => apiPost(`/reports/technical/technical-reports/${reportId}/approve`),
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

export const useEditTechnicalReport = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ reportId, data }) => apiPut(`/reports/technical/technical-reports/${reportId}`, data),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(updateTechnicalReportInList(data));
      queryClient.invalidateQueries(["technicalReports"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Technical report updated successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to update technical report";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
      throw error;
    },
  });
};

export const useRejectTechnicalReport = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    // backend router is mounted at /reports/technical
    mutationFn: ({ reportId }) => apiPatch(`/reports/technical/technical-reports/${reportId}/reject`),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(updateTechnicalReportInList(data));
      queryClient.invalidateQueries(["technicalReports"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Technical report rejected");
    },
    onError: (error) => {
      const message = error?.message || "Failed to reject technical report";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
      throw error;
    },
  });
};