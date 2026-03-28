import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { apiGet, apiPost, apiDelete } from "../lib/api/apiClient";
import { showSuccess, showError } from "../lib/utils/toastService";
import {
  setCreditReports,
  setReportData,
  setLoading,
  setError,
  addCreditReport,
  removeCreditReportFromList,
  clearError,
} from "../store/slices/creditReportSlice";

export const useRefreshCreditReport = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (payload) => apiPost("/credit-report/refresh", payload),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(setReportData(data));
      queryClient.invalidateQueries({ queryKey: ["creditReports"] });
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Credit report refreshed successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to refresh credit report";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useCreditReports = (applicantId, params = {}) => {
  const dispatch = useDispatch();
  const creditReports = useSelector(
    (state) => state.creditReport.creditReports,
  );
  const loading = useSelector((state) => state.creditReport.loading);
  const error = useSelector((state) => state.creditReport.error);

  const normalizedParams = normalizeParams(params);

  const query = useQuery({
    queryKey: ["creditReports", applicantId, normalizedParams],
    queryFn: () =>
      apiGet(`/credit-report/${applicantId}`, {
        params: normalizedParams,
      }),
    enabled: !!applicantId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (query.data !== undefined) {
      dispatch(setCreditReports(query.data));
      dispatch(clearError());
    }
  }, [query.data, dispatch]);

  useEffect(() => {
    if (query.error) {
      const message = query.error?.message || "Failed to fetch credit reports";
      dispatch(setError(message));
      showError(message);
    }
  }, [query.error, dispatch]);

  return {
    creditReports,
    loading: query.isPending || loading,
    error: error || query.error,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};

export const useCreditReportById = (id) => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["creditReport", id],
    queryFn: () => apiGet(`/credit-report/detail/${id}`),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.data !== undefined) {
      dispatch(setReportData(query.data));
      dispatch(clearError());
    }
  }, [query.data, dispatch]);

  useEffect(() => {
    if (query.error) {
      const message = query.error?.message || "Failed to fetch credit report";
      dispatch(setError(message));
      showError(message);
    }
  }, [query.error, dispatch]);

  return query;
};

export const useCreateCreditReport = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (payload) => apiPost('/credit-report', payload),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(addCreditReport(data));
      queryClient.invalidateQueries({ queryKey: ["creditReports"] });
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Credit report created successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to create credit report";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useDeleteCreditReport = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (id) => apiDelete(`/credit-report/${id}`),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data, variables) => {
      dispatch(removeCreditReportFromList(variables));
      queryClient.invalidateQueries({ queryKey: ["creditReports"] });
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Credit report deleted successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to delete credit report";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};
