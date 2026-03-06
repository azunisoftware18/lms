import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { showSuccess, showError } from "../lib/utils/toastService";
import {
  getAllPermissions,
  getUserPermissions,
  createPermission,
  assignPermissions,
} from "../lib/api/permission.api";
import {
  setLoading,
  setError,
  clearError,
  setPermissions,
  setUserPermissions,
  addPermission,
} from "../store/slices/permissionSlice";

export const usePermissions = () => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["permissions"],
    queryFn: getAllPermissions,
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
    queryFn: () => getUserPermissions(userId),
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
    mutationFn: createPermission,
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
    mutationFn: assignPermissions,
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