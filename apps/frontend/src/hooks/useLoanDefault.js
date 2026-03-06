import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { showSuccess, showError } from "../lib/utils/toastService";
import {
  getDefaultedLoans,
  getDefaultedLoanById,
  checkLoanDefault
} from "../lib/api/loanDefault.api";
import {
  setLoading,
  setError,
  clearError,
  setDefaultedLoans,
  setSelectedLoan,
} from "../store/slices/loanDefultslice";

export const useDefaultedLoans = () => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["defaultedLoans"],
    queryFn: getDefaultedLoans,
    onSuccess: (data) => {
      dispatch(setDefaultedLoans(data));
      dispatch(clearError());
    },
    onError: (err) => {
      const message = err?.message || "Failed to fetch defaulted loans";
      dispatch(setError(message));
      showError(message);
    },
  });
};

export const useDefaultedLoan = (loanId) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["defaultedLoan", loanId],
    queryFn: () => getDefaultedLoanById(loanId),
    enabled: !!loanId,
    onSuccess: (data) => {
      dispatch(setSelectedLoan(data));
      dispatch(clearError());
    },
    onError: (err) => {
      const message = err?.message || "Failed to fetch defaulted loan";
      dispatch(setError(message));
      showError(message);
    },
  });
};

export const useCheckLoanDefault = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: checkLoanDefault,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      qc.invalidateQueries(["defaultedLoans"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Loan default check completed successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to check loan default";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};