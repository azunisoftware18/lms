import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { apiGet, apiPost } from "../lib/api/apiClient";
import { showSuccess, showError } from "../lib/utils/toastService";
import { normalizeParams } from "../lib/utils/paramHelper";
import {
  setEmis,
  setEmiSchedule,
  setPayableAmount,
  setCalculatedEmi,
  setLoading,
  setError,
  updateEmiInList,
  clearError,
} from "../store/slices/emiSlice";

export const useAllEmis = (params = {}) => {
  const dispatch = useDispatch();
  const emis = useSelector((state) => state.emi.emis);
  const meta = useSelector((state) => state.emi.meta);
  const loading = useSelector((state) => state.emi.loading);
  const error = useSelector((state) => state.emi.error);

  const normalizedParams = normalizeParams(params);

  const { isFetching, refetch } = useQuery({
    queryKey: ["allEmis", normalizedParams],
    queryFn: () =>
      apiGet("/emi", {
        params: normalizedParams,
      }),
    keepPreviousData: true,
    onSuccess: (data) => {
      dispatch(setEmis(data));
      dispatch(clearError());
    },
    onError: (error) => {
      const message = error?.message || "Failed to fetch EMIs";
      dispatch(setError(message));
      showError(message);
    },
  });

  return { emis, meta, loading, error, isFetching, refetch };
};

export const useLoanEmis = (loanId) => {
  const dispatch = useDispatch();
  const emis = useSelector((state) => state.emi.emis);
  const loading = useSelector((state) => state.emi.loading);
  const error = useSelector((state) => state.emi.error);

  const query = useQuery({
    queryKey: ["emis", loanId],
    queryFn: () => apiGet(`/emi/loan-applications/${loanId}/emis`),
    enabled: !!loanId,
    onSuccess: (data) => {
      dispatch(setEmis(data));
      dispatch(clearError());
    },
    onError: (error) => {
      const message = error?.message || "Failed to fetch EMIs";
      dispatch(setError(message));
      showError(message);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Prefer the query result payload (many APIs return { success: true, data: [...] })
  const queryPayload = query.data?.data ?? query.data;

  return {
    emis: Array.isArray(queryPayload) ? queryPayload : emis,
    loading: query.isLoading || loading,
    error: error || query.error,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};

export const useGenerateSchedule = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  return useMutation({
    mutationFn: (loanIdOrPayload) => {
      // Accept either a plain loanId string or an object { loanId, emiStartDate }
      let loanId = loanIdOrPayload;
      let emiStartDate = undefined;
      if (loanIdOrPayload && typeof loanIdOrPayload === "object") {
        loanId = loanIdOrPayload.loanId || loanIdOrPayload.id || loanIdOrPayload.loanNumber;
        emiStartDate = loanIdOrPayload.emiStartDate || loanIdOrPayload.startDate;
      }
      const uid = user?.id || user?.userId || user?.uid || null;
      const bid = user?.branchId || (user?.branch && user.branch.id) || null;
      const payload = {
        userId: uid,
        branchId: bid,
        // include alternate common keys in case backend expects different naming
        createdBy: uid,
        created_by: uid,
      };
      if (emiStartDate) payload.emiStartDate = emiStartDate;
      return apiPost(`/emi/loan-applications/${loanId}/emis`, payload);
    },
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      // backend returns { success: true, data: [...] }
      const payload = data?.data ?? data;
      dispatch(setEmiSchedule(payload));
      queryClient.invalidateQueries(["emis"]);
      queryClient.invalidateQueries(["allEmis"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("EMI schedule generated successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to generate EMI schedule";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const usePayEmi = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ emiId, amountPaid, paymentMode }) =>
      apiPost(`/emi/${emiId}/pay`, { amountPaid, paymentMode }),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(updateEmiInList(data));
      queryClient.invalidateQueries(["emis"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("EMI payment successful!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to process EMI payment";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useCalculateEmi = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (payload) => apiPost("/emi/get-emi-amount", payload),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(setCalculatedEmi(data));
      dispatch(setLoading(false));
      dispatch(clearError());
    },
    onError: (error) => {
      const message = error?.message || "Failed to calculate EMI";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useEmiPayableAmount = (emiId) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["emiPayable", emiId],
    queryFn: () => apiGet(`/emi/loan-emis/${emiId}/payable-amount`),
    enabled: !!emiId,
    onSuccess: (data) => {
      dispatch(setPayableAmount(data));
      dispatch(clearError());
    },
    onError: (error) => {
      const message = error?.message || "Failed to fetch payable amount";
      dispatch(setError(message));
      showError(message);
    },
    staleTime: 1000 * 60 * 1, // 1 minute (more frequent for payment amounts)
  });
};

export const useApplyMoratorium = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ loanId, data }) =>
      apiPost(`/emi/loans/${loanId}/moratorium`, data),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["emis"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Moratorium applied successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to apply moratorium";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

// Fetch foreclosure summary (GET /emi/loans/:loanId/foreclose)
export const useGetForecloseSummary = (loanId) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["forecloseSummary", loanId],
    queryFn: () => apiGet(`/emi/loans/${loanId}/foreclose`),
    enabled: !!loanId,
    // map various possible API shapes into a consistent UI-friendly object
    select: (d) => {
      const payload = d?.data ?? d;
      if (!payload) return null;
      const outstanding =
        payload.outstandingPrincipal ?? payload.loanOutstanding ?? "";
      const accrued =
        payload.accruedInterest ??
        payload.interest ??
        payload.summary?.totalLateFee ??
        "";
      const charges = payload.foreclosureCharges ?? payload.charges ?? "";
      const total =
        payload.totalPayable ??
        payload.summary?.totalPayable ??
        payload.totalPayableAmount ??
        "";

      return {
        outstandingPrincipal: outstanding?.toString?.() || outstanding || "",
        accruedInterest: accrued?.toString?.() || accrued || "",
        foreclosureCharges: charges?.toString?.() || charges || "",
        totalPayable:
          typeof total === "number" ? total.toLocaleString("en-IN") : total,
      };
    },
    onSuccess: () => {
      dispatch(clearError());
    },
    onError: (error) => {
      const message = error?.message || "Failed to fetch foreclosure summary";
      dispatch(setError(message));
      showError(message);
    },
    staleTime: 1000 * 60 * 1,
  });
};

// Pay foreclosure (POST /emi/loans/:loanId/foreclose)
export const usePayForecloseLoan = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ loanId, payload }) =>
      apiPost(`/emi/loans/${loanId}/foreclose`, payload),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["emis"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Loan foreclosed successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to foreclose loan";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};
