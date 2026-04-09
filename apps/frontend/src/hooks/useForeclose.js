import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { apiGet, apiPost } from "../lib/api/apiClient";
import { showSuccess, showError } from "../lib/utils/toastService";
import {
  setLoading,
  setError,
  clearError,
  setSummary,
  setForeClosure,
} from "../store/slices/forecloseSlice";

// Fetch foreclose summary for a loan (loanId)
export const useForecloseSummary = (loanId) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["foreclose", loanId],
    queryFn: () => apiGet(`/foreclose/loans/${loanId}`),
    enabled: !!loanId,
    // controller returns { success, message, data }
    select: (d) => d?.data ?? d,
    onSuccess: (data) => {
      // data may be the summary object
      dispatch(setSummary(data));
      dispatch(clearError());
    },
    onError: (err) => {
      const message = err?.message || "Failed to fetch foreclose summary";
      dispatch(setError(message));
      showError(message);
    },
  });
};

export const useApplyForeclose = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ loanNumber, data }) =>
      apiPost(`/foreclose/loans/${loanNumber}/apply-foreclose`, data),
    onMutate: () => dispatch(setLoading(true)),
    onSuccess: () => {
      queryClient.invalidateQueries(["foreclose"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Foreclose application submitted");
    },
    onError: (err) => {
      const message = err?.message || "Failed to submit foreclose application";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const usePayForeclose = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ loanNumber, data }) =>
      apiPost(`/foreclose/loans/${loanNumber}/foreclose`, data),
    onMutate: () => dispatch(setLoading(true)),
    onSuccess: (res) => {
      // server returns { summary, payment, foreClosure }
      const payload = res?.data ?? res;
      if (payload?.summary) dispatch(setSummary(payload.summary));
      if (payload?.foreClosure) dispatch(setForeClosure(payload.foreClosure));
      queryClient.invalidateQueries(["foreclose"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Foreclose payment successful");
    },
    onError: (err) => {
      const message = err?.message || "Failed to pay foreclosure";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useApproveForeclose = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ loanNumber, approve }) =>
      apiPost(`/foreclose/loans/${loanNumber}/foreclose/approval`, { approve }),
    onMutate: () => dispatch(setLoading(true)),
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries(["foreclose"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      const approved = variables?.approve;
      showSuccess(approved ? "Foreclose approved" : "Foreclose rejected");
    },
    onError: (err) => {
      const message = err?.message || "Failed to approve/reject foreclose";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};
