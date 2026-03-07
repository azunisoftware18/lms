import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { showSuccess, showError } from "../lib/utils/toastService";
import {
  assignLoan,
  unassignLoan,
  getMyAssignedLoans
} from "../lib/api/loanAssignment.api";
import {
  setLoading,
  setError,
  clearError,
  setAssignedLoans,
  addAssignedLoan,
  removeAssignedLoan,
} from "../store/slices/loanAssignmentSlice";

export const useMyAssignedLoans = () => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["assignedLoans"],
    queryFn: getMyAssignedLoans,
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
    mutationFn: assignLoan,
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
    mutationFn: unassignLoan,
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