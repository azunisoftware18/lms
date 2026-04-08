import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { apiGet } from "../lib/api/apiClient";
import { showError } from "../lib/utils/toastService";
import {
  setLoading,
  setError,
  clearError,
  setEligibilityData,
} from "../store/slices/eligibilitySlice";

export const useEligibility = (loanApplicationId) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["eligibility", loanApplicationId],
    // Backend mounts the eligibility router under /risk
    queryFn: () => apiGet(`/risk/eligibility-check/${loanApplicationId}`),
    enabled: !!loanApplicationId,
    onSuccess: (data) => {
      dispatch(setEligibilityData(data));
      dispatch(clearError());
    },
    onError: (err) => {
      const message = err?.message || "Failed to check eligibility";
      dispatch(setError(message));
      showError(message);
    },
  });
};
