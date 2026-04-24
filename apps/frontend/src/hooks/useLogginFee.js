import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPatch, apiPost } from "../lib/api/apiClient";
import { showError, showSuccess } from "../lib/utils/toastService";
import { normalizeParams } from "../lib/utils/paramHelper";

const getAllLogginFees = (params = {}) =>
	apiGet("/loggin-fee/all", {
		params,
	});

const getLogginFeeById = (id) => apiGet(`/loggin-fee/${id}`);

const chargeLogginFee = (payload) => apiPost("/loggin-fee/charge", payload);

const updateLogginFeeStatus = ({ id, payload }) =>
	apiPatch(`/loggin-fee/${id}/status`, payload);

export const useLogginFeeList = (params = {}) => {
	const normalizedParams = normalizeParams(params || {});

	const query = useQuery({
		queryKey: ["logginFeeList", normalizedParams],
		queryFn: () => getAllLogginFees(normalizedParams),
		staleTime: 1000 * 60 * 3,
	});

	const payload = query.data?.data || {};

	return {
		fees: payload?.data || [],
		meta: payload?.meta || {
			page: normalizedParams.page || 1,
			limit: normalizedParams.limit || 10,
			total: 0,
			totalPages: 1,
		},
		loading: query.isLoading,
		error: query.error,
		isFetching: query.isFetching,
		refetch: query.refetch,
	};
};

export const useLogginFeeById = (id, options = {}) => {
	return useQuery({
		queryKey: ["logginFee", id],
		queryFn: () => getLogginFeeById(id),
		enabled: Boolean(id) && options.enabled !== false,
		staleTime: 1000 * 60 * 5,
		...options,
	});
};

export const useChargeLogginFee = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: chargeLogginFee,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["logginFeeList"] });
			showSuccess("Login fee charged successfully");
		},
		onError: (error) => {
			showError(error?.message || "Failed to charge login fee");
		},
	});
};

export const useUpdateLogginFeeStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateLogginFeeStatus,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["logginFeeList"] });
			showSuccess("Login fee status updated successfully");
		},
		onError: (error) => {
			showError(error?.message || "Failed to update login fee status");
		},
	});
};
