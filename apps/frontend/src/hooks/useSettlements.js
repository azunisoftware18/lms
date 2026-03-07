import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { showSuccess, showError } from "../lib/utils/toastService";
import {
  getAllSettlements,
  applySettlement,
  approveSettlement,
  paySettlement,
  rejectSettlement,
  getPayableAmount,
  getSettlementDashboard,
} from "../lib/api/settlement.api";
import {
  setLoading,
  setError,
  clearError,
  setSettlements,
  setPayableAmount,
} from "../store/slices/settlementSlice";

export const useSettlements = (params) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["settlements", params],
    queryFn: () => getAllSettlements(params),
    onSuccess: (data) => {
      dispatch(setSettlements(data));
      dispatch(clearError());
    },
    onError: (err) => {
      const message = err?.message || "Failed to fetch settlements";
      dispatch(setError(message));
      showError(message);
    },
  });
};

export const useApplySettlement = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: applySettlement,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["settlements"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Settlement applied successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to apply settlement";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useApproveSettlement = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: approveSettlement,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["settlements"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Settlement approved successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to approve settlement";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const usePaySettlement = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: paySettlement,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["settlements"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Settlement paid successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to pay settlement";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useRejectSettlement = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: rejectSettlement,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["settlements"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Settlement rejected successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to reject settlement";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const usePayableAmount = (recoveryId) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["payableAmount", recoveryId],
    queryFn: () => getPayableAmount(recoveryId),
    enabled: !!recoveryId,
    onSuccess: (data) => {
      dispatch(setPayableAmount(data));
      dispatch(clearError());
    },
    onError: (err) => {
      const message = err?.message || "Failed to fetch payable amount";
      dispatch(setError(message));
      showError(message);
    },
  });
};

export const useSettlementDashboard = () => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["settlementDashboard"],
    queryFn: getSettlementDashboard,
    onError: (err) => {
      const message = err?.message || "Failed to fetch settlement dashboard";
      dispatch(setError(message));
      showError(message);
    },
  });
};