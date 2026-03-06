import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { showSuccess, showError } from "../lib/utils/toastService";
import {
  getAllLegalReports,
  createLegalReport,
  approveLegalReport,
} from "../lib/api/legalReport.api";
import {
  setLoading,
  setError,
  clearError,
  setLegalReports,
  addLegalReport,
  updateLegalReportInList,
} from "../store/slices/legalReportSlice";

export const useLegalReports = (params) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["legalReports", params],
    queryFn: () => getAllLegalReports(params),
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
    mutationFn: createLegalReport,
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
    mutationFn: approveLegalReport,
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