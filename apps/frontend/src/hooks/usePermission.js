import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { apiGet, apiPost } from "../lib/api/apiClient";
import { showSuccess, showError } from "../lib/utils/toastService";
import { normalizeParams } from "../lib/utils/paramHelper";
import {
  setLoading,
  setError,
  clearError,
  setPermissions,
  setUserPermissions,
  setUsers,
  addPermission,
} from "../store/slices/permissionSlice";

export const usePermissions = (params = {}) => {
  const dispatch = useDispatch();
  const permissionState = useSelector(
    (state) =>
      state.permission ?? {
        permissions: [],
        loading: false,
        error: null,
      },
  );

  const normalizedParams = normalizeParams(params);

  const query = useQuery({
    queryKey: ["permissions", normalizedParams],
    queryFn: () =>
      apiGet("/permissions/all-permissions", {
        params: normalizedParams,
      }),
    select: (response) => response?.data ?? response,
    onError: (err) => {
      const message = err?.message || "Failed to fetch permissions";
      dispatch(setError(message));
      showError(message);
    },
  });

  useEffect(() => {
    if (!query.isSuccess) return;
    const permissions = Array.isArray(query.data) ? query.data : [];
    dispatch(setPermissions(permissions));
    dispatch(clearError());
  }, [dispatch, query.data, query.isSuccess]);

  return {
    ...query,
    permissions: permissionState.permissions,
    loading: query.isLoading || permissionState.loading,
    error: permissionState.error || query.error,
  };
};

export const useUserPermissions = (userId) => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["userPermissions", userId],
    queryFn: () => apiGet(`/permissions/user/${userId}`),
    enabled: !!userId,
    select: (response) => response?.data ?? response,
    onError: (err) => {
      const message = err?.message || "Failed to fetch user permissions";
      dispatch(setError(message));
      // Avoid toast spam for expected 403 in access-limited roles.
      if (err?.status !== 403) showError(message);
    },
  });

  useEffect(() => {
    if (!query.isSuccess) return;
    dispatch(setUserPermissions(query.data));
    dispatch(clearError());
  }, [dispatch, query.data, query.isSuccess]);

  return query;
};

export const usePermissionUsers = (params = {}) => {
  const dispatch = useDispatch();
  const normalizedParams = normalizeParams(params);

  const query = useQuery({
    queryKey: ["permissionUsers", normalizedParams],
    queryFn: () =>
      apiGet("/user/all", {
        params: normalizedParams,
      }),
    select: (response) => response?.data ?? response,
    onError: (err) => {
      const message = err?.message || "Failed to fetch users";
      dispatch(setError(message));
      showError(message);
    },
  });

  useEffect(() => {
    if (!query.isSuccess) return;
    dispatch(setUsers(Array.isArray(query.data) ? query.data : []));
    dispatch(clearError());
  }, [dispatch, query.data, query.isSuccess]);

  return query;
};

export const usePermissionGroups = () => {
  return useQuery({
    queryKey: ["permissionGroups"],
    queryFn: () => apiGet("/permissions/permission-groups"),
    select: (response) => response?.data ?? response ?? [],
  });
};

export const useCreatePermission = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (payload) =>
      apiPost("/permissions/create-permissions", payload),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (response) => {
      const permission = response?.data ?? response;
      if (permission) dispatch(addPermission(permission));
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPermissions"] });
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

export const useUnassignPermissions = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (payload) => apiPost("/permissions/unassign", payload),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPermissions"] });
      dispatch(setLoading(false));
      dispatch(clearError());
      showSuccess("Permissions unassigned successfully!");
    },
    onError: (error) => {
      const message = error?.message || "Failed to unassign permissions";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};
