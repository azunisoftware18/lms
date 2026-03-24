import { useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { apiGet, apiPost, apiPatch } from "../lib/api/apiClient";
import { showSuccess, showError } from "../lib/utils/toastService";
import { normalizeParams } from "../lib/utils/paramHelper";
import {
  setLeads,
  setLeadPagination,
  setLeadSearch,
  setLoading,
  setError,
  addLead,
  updateLeadInList,
  removeLeadFromList,
  clearError,
} from "../store/slices/leadSlice";

const getLeads = (params = {}) => apiGet("/lead/all", { params });
const createLead = (payload) => apiPost("/lead", payload);
const updateLeadStatus = ({ id, status }) =>
  apiPatch(`/lead/update-status/${id}`, { status });
const assignLead = ({ id, payload }) =>
  apiPatch(`/lead/assign/${id}`, payload);
const convertLeadToLoan = (id) => apiGet(`/lead/convert-to-loan/${id}`);

const extractLeadsList = (response) => {
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.items)) return response.items;
  return [];
};

const extractLeadsMeta = (response, normalizedParams) => {
  const meta = response?.data?.meta || response?.meta || {};
  const page = meta.page ?? normalizedParams.page ?? 1;
  const limit = meta.limit ?? normalizedParams.limit ?? 10;
  const total = meta.total ?? 0;
  const totalPages = Math.max(1, Math.ceil((total || 0) / (limit || 10)));

  return {
    page,
    limit,
    total,
    totalPages,
  };
};

const extractLeadEntity = (response) => {
  if (response?.data && !Array.isArray(response.data)) {
    return response.data;
  }
  return response;
};

export const useLead = (params) => {
  const dispatch = useDispatch();
  const leadsFromStore = useSelector((state) => state?.lead?.leads || []);
  const paginationFromStore = useSelector((state) => state?.lead?.pagination || {});
  const loading = useSelector((state) => state?.lead?.loading || false);
  const error = useSelector((state) => state?.lead?.error || null);
  const normalizedParams = useMemo(
    () => normalizeParams(params || {}),
    [
      params?.page,
      params?.limit,
      params?.search,
      params?.q,
      params?.isActive,
      params?.isPublic,
      params?.publicOnly,
    ],
  );

  const query = useQuery({
    queryKey: ["leads", normalizedParams],
    queryFn: () => getLeads(normalizedParams),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!query.data) return;

    const list = extractLeadsList(query.data);
    const meta = extractLeadsMeta(query.data, normalizedParams);

    dispatch(setLeads(list));
    dispatch(setLeadPagination(meta));
    dispatch(setLeadSearch(normalizedParams.search || ""));
    dispatch(clearError());
  }, [
    query.data,
    dispatch,
    normalizedParams.page,
    normalizedParams.limit,
    normalizedParams.search,
  ]);

  useEffect(() => {
    if (!query.error) return;
    const message = query.error?.message || "Failed to fetch leads";
    dispatch(setError(message));
    showError(message);
  }, [query.error, dispatch]);

  const meta = extractLeadsMeta(query.data, normalizedParams);

  const normalizedLeads = {
    data: leadsFromStore,
    total: paginationFromStore?.total ?? meta.total ?? leadsFromStore.length,
    page: paginationFromStore?.page ?? meta.page,
    limit: paginationFromStore?.limit ?? meta.limit,
    totalPages: paginationFromStore?.totalPages ?? meta.totalPages,
  };

  return {
    leads: normalizedLeads,
    loading: query.isPending || loading,
    error: error || query.error,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: createLead,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(addLead(extractLeadEntity(data)));
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Lead created successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to create lead";
      dispatch(setLoading(false));
      dispatch(setError(message));
      showError(message);
    },
  });
};

export const useUpdateLeadStatus = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: updateLeadStatus,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(updateLeadInList(extractLeadEntity(data)));
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Lead status updated successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to update lead status";
      dispatch(setLoading(false));
      dispatch(setError(message));
      showError(message);
    },
  });
};

export const useAssignLead = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: assignLead,
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(updateLeadInList(extractLeadEntity(data)));
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Lead assigned successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to assign lead";
      dispatch(setLoading(false));
      dispatch(setError(message));
      showError(message);
    },
  });
};

export const useConvertLeadToLoan = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: convertLeadToLoan,
    onMutate: () => {
      dispatch(setLoading(true));
    },

    onSuccess: (_data, leadId) => {
      dispatch(removeLeadFromList(leadId));
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Lead converted to loan successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to convert lead to loan";
      dispatch(setLoading(false));
      dispatch(setError(message));
      showError(message);
    },
  });
};
