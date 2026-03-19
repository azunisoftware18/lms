import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { apiGet, apiPost, apiPut, apiDelete } from "../lib/api/apiClient";
import { showSuccess, showError } from "../lib/utils/toastService";
import { normalizeParams } from "../lib/utils/paramHelper";
import {
  setBranches,
  setMainBranches,
  setLoading,
  setError,
  addBranch,
  updateBranchInList,
  removeBranchFromList,
  clearError,
} from "../store/slices/branchSlice";

const extractBranchList = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.items)) return response.items;
  return [];
};

const extractPagination = (response, normalizedParams, fallbackTotal = 0) => {
  const pagination =
    response?.data?.pagination || response?.pagination || response?.meta || {};
  const total = pagination?.total ?? fallbackTotal;
  const limit = pagination?.limit ?? normalizedParams.limit;
  const page = pagination?.page ?? normalizedParams.page;
  const totalPages =
    pagination?.totalPages ??
    Math.max(1, Math.ceil((total || 0) / (limit || 10)));

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: pagination?.hasNextPage ?? page < totalPages,
    hasPrevPage: pagination?.hasPrevPage ?? page > 1,
  };
};

const extractBranchEntity = (response) => {
  if (response?.data?.data && !Array.isArray(response.data.data))
    return response.data.data;
  if (response?.data && !Array.isArray(response.data)) return response.data;
  return response;
};

export const useCreateBranch = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (payload) => apiPost("/branches", payload),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(addBranch(extractBranchEntity(data)));
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Branch created successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to create branch";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useUpdateBranch = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ id, branchData }) => apiPut(`/branches/${id}`, branchData),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(updateBranchInList(extractBranchEntity(data)));
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Branch updated successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to update branch";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useDeleteBranch = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (id) => apiDelete(`/branches/${id}`),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (_data, variables) => {
      dispatch(removeBranchFromList(variables));
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Branch deleted successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to delete branch";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useCreateBulkBranches = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (payload) => apiPost("/branches/bulk", payload),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      queryClient.invalidateQueries({ queryKey: ["mainBranches"] });
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess(data?.message || "Bulk branches created successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to create bulk branches";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useReassignBulkBranches = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (payload) => apiPut("/branches/bulk/reassign", payload),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      queryClient.invalidateQueries({ queryKey: ["mainBranches"] });
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess(data?.message || "Bulk branches reassigned successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to reassign bulk branches";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useBranches = (params = {}) => {
  const dispatch = useDispatch();
  const branches = useSelector((state) => state.branch.branches);
  const loading = useSelector((state) => state.branch.loading);
  const error = useSelector((state) => state.branch.error);
  const normalizedParams = normalizeParams(params);

  const query = useQuery({
    queryKey: ["branches", normalizedParams],
    queryFn: () => apiGet("/branches", { params: normalizedParams }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (query.data) {
      dispatch(setBranches(extractBranchList(query.data)));
      dispatch(clearError());
    }
  }, [query.data, dispatch]);

  useEffect(() => {
    if (query.error) {
      const message = query.error?.message || "Failed to fetch branches";
      dispatch(setError(message));
      showError(message);
    }
  }, [query.error, dispatch]);

  const pagination = extractPagination(
    query.data,
    normalizedParams,
    branches.length,
  );

  return {
    branches,
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

export const useBranchById = (id) => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["branch", id],
    queryFn: () => apiGet(`/branches/${id}`),
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
      const message = query.error?.message || `Failed to fetch branch`;
      dispatch(setError(message));
      showError(message);
    }
  }, [query.error, dispatch]);

  return query;
};

export const useMainBranches = (params = {}) => {
  const dispatch = useDispatch();
  const mainBranches = useSelector((state) => state.branch.mainBranches);
  const loading = useSelector((state) => state.branch.loading);
  const error = useSelector((state) => state.branch.error);
  const normalizedParams = normalizeParams(params);

  const query = useQuery({
    queryKey: ["mainBranches", normalizedParams],
    queryFn: () => apiGet("/branches/main", { params: normalizedParams }),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.data) {
      dispatch(setMainBranches(extractBranchList(query.data)));
      dispatch(clearError());
    }
  }, [query.data, dispatch]);

  useEffect(() => {
    if (query.error) {
      const message = query.error?.message || "Failed to fetch main branches";
      dispatch(setError(message));
      showError(message);
    }
  }, [query.error, dispatch]);

  return {
    mainBranches,
    loading: query.isLoading || loading,
    error: error || query.error,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};
