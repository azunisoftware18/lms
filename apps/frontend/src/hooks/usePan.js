import { useMutation } from "@tanstack/react-query";
import { apiPost } from "../lib/api/apiClient";
import { showSuccess, showError } from "../lib/utils/toastService";



const panDetails = ({ panNumber }) => {
  const normalizedPan = String(panNumber ?? "").trim().toUpperCase();
    if (!/^[A-Z]{5}\d{4}[A-Z]$/.test(normalizedPan)) {
        throw new Error("Invalid PAN number. Expected format: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F).");
    }
    return apiPost("/pan/details", { panNumber: normalizedPan });
};

export const usePanDetails = (options = {} ) => {
    return useMutation({
        ...options,
        mutationFn: panDetails,
        onSuccess: (data, variables, context) => {
			showSuccess(options.successMessage || "PAN details fetched successfully");
			options.onSuccess?.(data, variables, context);
		},
        onError: (error, variables, context) => { 
            const message = error?.message || "Failed to fetch PAN details";
            showError(message);
            options.onError?.(error, variables, context);
        }
    });
};

