import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { apiGet, apiPost } from "../lib/api/apiClient";
import { showSuccess, showError } from "../lib/utils/toastService";
import { normalizeParams } from "../lib/utils/paramHelper";
import {
  setLoading,
  setError,
  clearError,
  setSettlements,
  setPayableAmount,
} from "../store/slices/settlementSlice";

export const useSettlements = (params = {}) => {
  const dispatch = useDispatch();
  const normalizedParams = {
    ...normalizeParams(params),
    status: params?.status,
  };

  return useQuery({
    queryKey: ["settlements", normalizedParams],
    queryFn: () => apiGet("/settlements", { params: normalizedParams }),
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
    mutationFn: ({ recoveryId, data }) =>
      apiPost(`/recoveries/${recoveryId}/apply-settlement`, data),
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
    mutationFn: ({ recoveryId, data }) =>
      apiPost(`/recoveries/${recoveryId}/settlement/approve`, data),
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
    mutationFn: ({ recoveryId, data }) =>
      apiPost(`/recoveries/${recoveryId}/settlement/pay`, data),
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
    mutationFn: ({ recoveryId, data }) =>
      apiPost(`/recoveries/${recoveryId}/settlement/reject`, data),
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
    queryFn: () =>
      apiGet(`/recoveries/${recoveryId}/settlement/payable-amount`),
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
    queryFn: () => apiGet("/settlements/dashboard"),
    onError: (err) => {
      const message = err?.message || "Failed to fetch settlement dashboard";
      dispatch(setError(message));
      showError(message);
    },
  });
};

// Fetch settlements for a specific loan: GET /loan-applications/:loanId/settlements
export const useSettlementsByLoan = (loanId) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["settlementsByLoan", loanId],
    queryFn: () => apiGet(`/loan-applications/${loanId}/settlements`),
    enabled: !!loanId,
    // controller returns { success, message, data: [...] }
    select: (d) => d?.data ?? d,
    onError: (err) => {
      const message = err?.message || "Failed to fetch settlements for loan";
      dispatch(setError(message));
      showError(message);
    },
  });
};
