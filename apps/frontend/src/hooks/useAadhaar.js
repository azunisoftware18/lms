import { useMutation } from "@tanstack/react-query";
import { apiPost } from "../lib/api/apiClient";
import { showSuccess, showError } from "../lib/utils/toastService";

const normalizeDigits = (value) => String(value ?? "").replace(/\D/g, "");

const validateAadhaarNumber = (aadhaarNumber) => {
	const normalized = normalizeDigits(aadhaarNumber);
	if (!/^\d{12}$/.test(normalized)) {
		throw new Error("Invalid Aadhaar number. Expected 12 digits.");
	}
	return normalized;
};

const validateOtp = (otp) => {
	const normalized = normalizeDigits(otp);
	if (!/^\d{4,6}$/.test(normalized)) {
		throw new Error("Invalid OTP. Expected 4-6 digits.");
	}
	return normalized;
};

const validateRefId = (refId) => {
	const normalized = String(refId ?? "").trim();
	if (!normalized) {
		throw new Error("Invalid reference id. Expected ref_id from send OTP response.");
	}
	return normalized;
};

const sendAadhaarOtp = ({ aadhaarNumber }) => {
	const normalizedAadhaar = validateAadhaarNumber(aadhaarNumber);
	return apiPost("/aadhaar/send-otp", { aadhaarNumber: normalizedAadhaar });
};

const verifyAadhaarOtp = ({ ref_id, otp }) => {
	const normalizedRefId = validateRefId(ref_id);
	const normalizedOtp = validateOtp(otp);
	return apiPost("/aadhaar/verify-otp", {
		ref_id: normalizedRefId,
		otp: normalizedOtp,
	});
};

export const useSendAadhaarOtp = (options = {}) => {
	return useMutation({
		...options,
		mutationFn: sendAadhaarOtp,
		onSuccess: (data, variables, context) => {
			showSuccess(options.successMessage || "OTP sent successfully");
			options.onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = error?.message || "Failed to send OTP";
			showError(message);
			options.onError?.(error, variables, context);
		},
	});
};

export const useVerifyAadhaarOtp = (options = {}) => {
	return useMutation({
		...options,
		mutationFn: verifyAadhaarOtp,
		onSuccess: (data, variables, context) => {
			showSuccess(options.successMessage || "Aadhaar verified successfully");
			options.onSuccess?.(data, variables, context);
		},
		onError: (error, variables, context) => {
			const message = error?.message || "Failed to verify OTP";
			showError(message);
			options.onError?.(error, variables, context);
		},
	});
};

export const useAadhaar = () => {
	const sendOtp = useSendAadhaarOtp();
	const verifyOtp = useVerifyAadhaarOtp();

	return {
		sendOtp,
		verifyOtp,
		isLoading: sendOtp.isPending || verifyOtp.isPending,
	};
};

export default useAadhaar;
