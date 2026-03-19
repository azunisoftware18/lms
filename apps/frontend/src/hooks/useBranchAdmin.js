import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { apiGet, apiPost, apiPut, apiDelete } from "../lib/api/apiClient";
import { showSuccess, showError } from "../lib/utils/toastService";
import { normalizeParams } from "../lib/utils/paramHelper";
import {
  setBranchAdmins,
  setLoading,
  setError,
  addBranchAdmin,
  updateBranchAdminInList,
  removeBranchAdminFromList,
  clearError,
} from "../store/slices/branchAdminSlice";

const extractBranchAdminList = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.items)) return response.items;
  return [];
};

const extractBranchAdminEntity = (response) => {
  if (response?.data?.data && !Array.isArray(response.data.data)) {
    return response.data.data;
  }

  if (response?.data && !Array.isArray(response.data)) {
    return response.data;
  }

  return response;
};

const extractPagination = (response, normalizedParams, fallbackTotal = 0) => {
  const pagination =
    response?.data?.pagination || response?.pagination || response?.meta || {};

  const total = pagination?.total ?? fallbackTotal;
  const limit = pagination?.limit ?? normalizedParams.limit;
  const page = pagination?.page ?? normalizedParams.page;
  const totalPages =
    pagination?.totalPages ?? Math.max(1, Math.ceil((total || 0) / (limit || 10)));

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: pagination?.hasNextPage ?? pagination?.hasNext ?? page < totalPages,
    hasPrevPage: pagination?.hasPrevPage ?? pagination?.hasPrev ?? page > 1,
  };
};

export const useCreateBranchAdmin = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (payload) => apiPost("/branch-admins/create-admin", payload),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(addBranchAdmin(extractBranchAdminEntity(data)));
      queryClient.invalidateQueries({ queryKey: ["branchAdmins"] });
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Branch admin created successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to create branch admin";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useUpdateBranchAdmin = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ id, data }) => apiPut(`/branch-admins/update-admin/${id}`, data),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(updateBranchAdminInList(extractBranchAdminEntity(data)));
      queryClient.invalidateQueries({ queryKey: ["branchAdmins"] });
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Branch admin updated successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to update branch admin";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useDeleteBranchAdmin = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (id) => apiDelete(`/branch-admins/${id}`),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (_data, variables) => {
      dispatch(removeBranchAdminFromList(variables));
      queryClient.invalidateQueries({ queryKey: ["branchAdmins"] });
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Branch admin deleted successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to delete branch admin";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useBranchAdmins = (params = {}) => {
  const dispatch = useDispatch();
  const branchAdmins = useSelector((state) => state.branchAdmin.branchAdmins);
  const loading = useSelector((state) => state.branchAdmin.loading);
  const error = useSelector((state) => state.branchAdmin.error);

  const normalizedParams = normalizeParams(params);
  const requestParams = {
    ...normalizedParams,
    ...(params.status ? { status: params.status } : {}),
  };

  const query = useQuery({
    queryKey: ["branchAdmins", requestParams],
    queryFn: () => apiGet("/branch-admins", { params: requestParams }),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.data) {
      dispatch(setBranchAdmins(extractBranchAdminList(query.data)));
      dispatch(clearError());
    }
  }, [query.data, dispatch]);

  useEffect(() => {
    if (query.error) {
      const message = query.error?.message || "Failed to fetch branch admins";
      dispatch(setError(message));
      showError(message);
    }
  }, [query.error, dispatch]);

  const pagination = extractPagination(
    query.data,
    normalizedParams,
    branchAdmins.length,
  );

  return {
    branchAdmins,
    pagination,
    total: pagination.total,
    page: pagination.page,
    limit: pagination.limit,
    totalPages: pagination.totalPages,
    loading: query.isLoading || loading,
    error: error || query.error,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};

export const useBranchAdminById = (id) => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["branchAdmin", id],
    queryFn: () => apiGet(`/branch-admins/${id}`),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.data) {
      dispatch(clearError());
    }
  }, [query.data, dispatch]);

  useEffect(() => {
    if (query.error) {
      const message = query.error?.message || "Failed to fetch branch admin";
      dispatch(setError(message));
      showError(message);
    }
  }, [query.error, dispatch]);

  return query;
};