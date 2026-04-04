import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { apiPost } from "../lib/api/apiClient";
import {
  setLoading,
  setError,
  clearError,
} from "../store/slices/disbursementSlice";
import { showSuccess, showError } from "../lib/utils/toastService";

export const useDisbursement = ({
  onSuccess: onSuccessCallback,
  onError: onErrorCallback,
  onSettled: onSettledCallback,
} = {}) => {
  const qc = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    // SAME PATTERN AS createLoanApplication
    mutationFn: ({ loanNumber, payload }) => {
      if (!loanNumber) throw new Error("Loan Number is required");

      return apiPost(`/disbursement/${loanNumber}/disburse`, payload);
    },

    onMutate: () => {
      dispatch(setLoading(true));
    },

    onSuccess: (data, variables, context) => {
      dispatch(setLoading(false));
      dispatch(clearError());

      // optional: store update
      // dispatch(addDisbursement(data));

      // 🔄 refetch
      qc.invalidateQueries({ queryKey: ["loanApplications"] });
      qc.invalidateQueries({ queryKey: ["disbursements"] });

      showSuccess("Disbursement successful");

      if (typeof onSuccessCallback === "function") {
        onSuccessCallback(data, variables, context);
      }
    },

    onError: (error, variables, context) => {
      let serverMsg = "Disbursement failed ❌";

      try {
        // IMPORTANT: apiClient already returns response.data
        if (!error) {
          serverMsg = "Unknown error";
        } else if (typeof error === "string") {
          serverMsg = error;
        } else if (error?.message) {
          serverMsg = error.message;
        } else if (error?.error) {
          serverMsg = error.error;
        } else if (error?.errors) {
          if (Array.isArray(error.errors)) {
            serverMsg = error.errors
              .map((e) => `${e.path}: ${e.message}`)
              .join(" • ");
          }
        } else {
          serverMsg = JSON.stringify(error);
        }
      } catch {
        serverMsg = "Error parsing server response";
      }

      dispatch(setError(serverMsg));
      dispatch(setLoading(false));
      showError(serverMsg);

      if (typeof onErrorCallback === "function") {
        onErrorCallback(error, variables, context);
      }
    },

    onSettled: (data, error, variables, context) => {
      if (typeof onSettledCallback === "function") {
        onSettledCallback(data, error, variables, context);
      }
    },
  });
};
