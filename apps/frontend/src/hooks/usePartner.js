import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { apiGet, apiPost, apiPatch } from "../lib/api/apiClient";
import { showSuccess, showError } from "../lib/utils/toastService";
import { normalizeParams } from "../lib/utils/paramHelper";
import {
  setLoading,
  setError,
  clearError,
  setPartners,
  addPartner,
  updatePartnerInList,
} from "../store/slices/partnerSlice";

export const usePartners = (params = {}) => {
  const dispatch = useDispatch();
  const partners = useSelector((state) => state.partner.partners);
  const meta = useSelector((state) => state.partner.meta);
  const loading = useSelector((state) => state.partner.loading);
  const error = useSelector((state) => state.partner.error);

  const normalizedParams = normalizeParams(params);

  const queryResult = useQuery({
    queryKey: ["partners", normalizedParams],
    queryFn: () =>
      apiGet("/partner/all", {
        params: normalizedParams,
      }),
    keepPreviousData: true,
    onSuccess: async (data) => {
      // Normalize various backend response shapes to an array
      const normalize = (d) => {
        if (!d) return [];
        if (Array.isArray(d)) return d;
        if (Array.isArray(d.data)) return d.data;
        if (Array.isArray(d?.data?.data)) return d.data.data;
        if (Array.isArray(d.partners)) return d.partners;
        return [];
      };

      // Normalize the response into an array if possible
      const partnersArray = normalize(data);

      // If normalization produced no rows, assume the server returned an empty
      // body (304) or an empty list. If we already have partners in the store,
      // avoid clearing them — likely a 304 'Not Modified' response.
      if (!Array.isArray(partnersArray) || partnersArray.length === 0) {
        if (Array.isArray(partners) && partners.length > 0) {
          // preserve existing store
          return;
        }

        // store is empty and server returned no rows — try a fresh no-cache fetch
        try {
          // Build query string from normalizedParams
          const qs = new URLSearchParams(
            Object.entries(normalizedParams),
          ).toString();
          const base =
            import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
          const token = localStorage.getItem("token");
          const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Cache-Control": "no-store",
          };
          if (token) headers.Authorization = `Bearer ${token}`;

          // Append a timestamp to bypass conditional GET/ETag behavior on the server
          const sep = qs ? `?${qs}&_ts=${Date.now()}` : `?_ts=${Date.now()}`;
          const res = await fetch(`${base}/partner/all${sep}`, {
            method: "GET",
            credentials: "include",
            cache: "no-store",
            headers: {
              ...headers,
              Pragma: "no-cache",
              "If-Modified-Since": "0",
              "If-None-Match": "",
            },
          });
          if (!res.ok) throw new Error(`Fetch failed ${res.status}`);
          const fresh = await res.json();
          const freshArr = normalize(fresh);
          dispatch(setPartners(freshArr || []));
          dispatch(clearError());
        } catch (e) {
          // keep existing store state on failure
          error(`Failed to refetch partners with no-cache: ${e.message}`);
        }

        return;
      }

      // We have a non-empty partners array — update the store.
      dispatch(setPartners(partnersArray));
      dispatch(clearError());
    },
    onError: (err) => {
      const message = err?.message || "Failed to fetch partners";
      dispatch(setError(message));
      showError(message);
    },
  });

  const { isFetching, refetch } = queryResult;

  // Provide a fallback to use the query response directly when the Redux
  // store is still empty (helps when dispatch may not have propagated yet).
  const queryData = queryResult.data;
  const normalizeQuery = (d) => {
    if (!d) return [];
    if (Array.isArray(d)) return d;
    if (Array.isArray(d.data)) return d.data;
    if (Array.isArray(d?.data?.data)) return d.data.data;
    if (Array.isArray(d.partners)) return d.partners;
    return [];
  };

  const normalizedFromQuery = normalizeQuery(queryData);
  const partnersToReturn =
    Array.isArray(partners) && partners.length > 0
      ? partners
      : normalizedFromQuery;

  return {
    partners: partnersToReturn,
    meta,
    loading,
    error,
    isFetching,
    refetch,
  };
};

export const useUploadPartnerDocuments = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ partnerId, formData }) =>
      apiPost(`/partner/${partnerId}/documents/upload`, formData),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: () => {
      dispatch(setLoading(false));
      dispatch(clearError());
      queryClient.invalidateQueries(["partners"]);
      showSuccess("Documents uploaded successfully");
    },
    onError: (err) => {
      const message = err?.message || "Failed to upload documents";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useCreatePartner = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (payload) => apiPost("/partner", payload),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      const partner = data?.data || data;
      dispatch(addPartner(partner));
      queryClient.invalidateQueries(["partners"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Partner created successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to create partner";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useUpdatePartner = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ id, data }) => apiPatch(`/partner/${id}`, data),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      const partner = data?.data || data;
      dispatch(updatePartnerInList(partner));
      queryClient.invalidateQueries(["partners"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Partner updated successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to update partner";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useCreatePartnerLead = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (payload) => apiPost("/partner/create-lead", payload),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: () => {
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Partner lead created successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to create partner lead";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useCreatePartnerLoan = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (payload) =>
      apiPost("/partner/create-loan-application", payload),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: () => {
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Partner loan created successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to create partner loan";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};
