import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { apiGet, apiPost } from "../lib/api/apiClient";
import { showSuccess, showError } from "../lib/utils/toastService";import { normalizeParams } from '../lib/utils/paramHelper';import {
  setLoading,
  setError,
  clearError,
  setPermissions,
  setUserPermissions,
  addPermission,
} from "../store/slices/permissionSlice";

export const usePermissions = (params = {}) => {
  const dispatch = useDispatch();
  const normalizedParams = normalizeParams(params);

  return useQuery({
    queryKey: ["permissions", normalizedParams],
    queryFn: () =>
      apiGet("/permissions/all-permissions", {
        params: normalizedParams,
      }),
    onSuccess: (data) => {
      dispatch(setPermissions(data));
      dispatch(clearError());
    },
    onError: (err) => {
      const message = err?.message || "Failed to fetch permissions";
      dispatch(setError(message));
      showError(message);
    },
  });
};


export const useUserPermissions = (userId) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["userPermissions", userId],
    queryFn: () => apiGet(`/permissions/user/${userId}`),
    enabled: !!userId,
    onSuccess: (data) => {
      dispatch(setUserPermissions(data));
      dispatch(clearError());
    },
    onError: (err) => {
      const message = err?.message || "Failed to fetch user permissions";
      dispatch(setError(message));
      showError(message);
    },
  });
};

export const useCreatePermission = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (payload) => apiPost("/permissions/create-permissions", payload),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      dispatch(addPermission(data));
      queryClient.invalidateQueries(["permissions"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Permission created successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to create permission";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useAssignPermissions = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (payload) => apiPost("/permissions/assign", payload),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["userPermissions"]);
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Permissions assigned successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to assign permissions";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};