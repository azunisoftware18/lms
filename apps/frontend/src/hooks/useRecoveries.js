import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { showSuccess, showError } from "../lib/utils/toastService";
import {
  getAllRecoveries,
  getRecoveryDetails,
  payRecovery,
  assignRecoveryAgent,
  updateRecoveryStage,
  getRecoveryDashboard,
  getAgentRecoveries,
} from "../lib/api/recovery.api";
import {
  setLoading,
  setError,
  clearError,
  setRecoveries,
  setRecoveryDetails,
} from "../store/slices/recoverySlice";

export const useRecoveries = (params) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["recoveries", params],
    queryFn: () => getAllRecoveries(params),
    onSuccess: (data) => {
      dispatch(setRecoveries(data));
      dispatch(clearError());
    },
    onError: (err) => {
      const message = err?.message || "Failed to fetch recoveries";
      dispatch(setError(message));
      showError(message);
    },
  });
};

export const useRecoveryDetails = (recoveryId) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["recoveryDetails", recoveryId],
    queryFn: () => getRecoveryDetails(recoveryId),
    enabled: !!recoveryId,
    onSuccess: (data) => {
      dispatch(setRecoveryDetails(data));
      dispatch(clearError());
    },
    onError: (err) => {
      const message = err?.message || "Failed to fetch recovery details";
      dispatch(setError(message));
      showError(message);
    },
  });
};

export const usePayRecovery = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: payRecovery,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["recoveries"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Recovery payment processed successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to process recovery payment";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useAssignRecoveryAgent = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: assignRecoveryAgent,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["recoveries"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Recovery agent assigned successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to assign recovery agent";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};


export const useUpdateRecoveryStage = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: updateRecoveryStage,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["recoveries"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Recovery stage updated successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to update recovery stage";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useRecoveryDashboard = () => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["recoveryDashboard"],
    queryFn: getRecoveryDashboard,
    onError: (err) => {
      const message = err?.message || "Failed to fetch recovery dashboard";
      dispatch(setError(message));
      showError(message);
    },
  });
};