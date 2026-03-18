import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { apiGet, apiPost } from "../lib/api/apiClient";
import { showSuccess, showError } from "../lib/utils/toastService";
import { normalizeParams } from "../lib/utils/paramHelper";
import {
  setLoading,
  setError,
  clearError,
  setAssignedLoans,
  addAssignedLoan,
  removeAssignedLoan,
} from "../store/slices/loanAssignmentSlice";

export const useMyAssignedLoans = (params = {}) => {
  const dispatch = useDispatch();
  const normalizedParams = normalizeParams(params);

  return useQuery({
    queryKey: ["assignedLoans", normalizedParams],
    queryFn: () =>
      apiGet("/loan-assignment/my-assigned-loans", {
        params: normalizedParams,
      }),
    onSuccess: (data) => {
      dispatch(setAssignedLoans(data));
    },
    onError: (err) => {
      const message = err?.message || "Failed to fetch assigned loans";
      dispatch(setError(message));
      showError(message);
    },
  });
};

export const useAssignLoan = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ loanApplicationId, employeeId, role }) =>
      apiPost(`/loan-assignment/loans/${loanApplicationId}/assign`, {
        employeeId,
        role,
      }),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(addAssignedLoan(data));
      qc.invalidateQueries(["assignedLoans"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Loan assigned successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to assign loan";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useUnassignLoan = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (assignmentId) =>
      apiPost(`/loan-assignment/loans/unassign/${assignmentId}`),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(removeAssignedLoan(data?.assignmentId || data?.id));
      qc.invalidateQueries(["assignedLoans"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Loan unassigned successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to unassign loan";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};