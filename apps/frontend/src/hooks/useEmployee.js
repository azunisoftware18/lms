import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { apiGet, apiPost, apiPatch, apiDelete } from "../lib/api/apiClient";
import { showSuccess, showError } from "../lib/utils/toastService";
import { normalizeParams } from "../lib/utils/paramHelper";
import {
  setEmployees,
  setLoading,
  setError,
  addEmployee,
  updateEmployeeInList,
  removeEmployeeFromList,
  clearError,
} from "../store/slices/employeeSlice";
export const useEmployees = (params = {}) => {
  const dispatch = useDispatch();
  const employeeState = useSelector(
    (state) =>
      state.employee ?? {
        employees: [],
        meta: null,
        loading: false,
        error: null,
      },
  );
  const employees = employeeState.employees;
  const meta = employeeState.meta;
  const loading = employeeState.loading;
  const error = employeeState.error;

  const normalizedParams = normalizeParams(params);

  const query = useQuery({
    queryKey: ["employees", normalizedParams],
    queryFn: () =>
      apiGet("/employee/all", {
        params: normalizedParams,
      }),
    keepPreviousData: true,
    onSuccess: (response) => {
      const payload = response?.data ?? response;
      dispatch(setEmployees(payload));
      dispatch(clearError());
    },
    onError: (queryError) => {
      const message = queryError?.message || "Failed to fetch employees";
      dispatch(setError(message));
      showError(message);
    },
    staleTime: 1000 * 60 * 5,
  });

  return {
    employees,
    meta,
    loading: query.isLoading || loading,
    error: error || query.error,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};

export const useEmployee = (id) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["employee", id],
    queryFn: () => apiGet(`/employee/${id}`),
    enabled: !!id,
    onSuccess: () => {
      dispatch(clearError());
    },
    onError: (queryError) => {
      const message = queryError?.message || "Failed to fetch employee";
      dispatch(setError(message));
      showError(message);
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (payload) => apiPost("/employee", payload),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (response) => {
      const created = response?.data?.employee ?? response?.employee ?? null;
      if (created) {
        dispatch(addEmployee(created));
      }
      dispatch(setLoading(false));
      dispatch(clearError());
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      showSuccess("Employee created successfully!");
    },
    onError: (mutationError) => {
      const message = mutationError?.message || "Failed to create employee";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ id, data }) => apiPatch(`/employee/${id}`, data),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (response) => {
      const updated = response?.data?.employee ?? response?.employee ?? null;
      if (updated) {
        dispatch(updateEmployeeInList(updated));
      }
      dispatch(setLoading(false));
      dispatch(clearError());
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employee"] });
      showSuccess("Employee updated successfully!");
    },
    onError: (mutationError) => {
      const message = mutationError?.message || "Failed to update employee";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (id) => apiDelete(`/employee/${id}`),
    onMutate: () => {
      dispatch(setLoading(true));
    },
    onSuccess: (_, id) => {
      dispatch(removeEmployeeFromList(id));
      dispatch(setLoading(false));
      dispatch(clearError());
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      showSuccess("Employee deleted successfully!");
    },
    onError: (mutationError) => {
      const message = mutationError?.message || "Failed to delete employee";
      dispatch(setError(message));
      dispatch(setLoading(false));
      showError(message);
    },
  });
};

export const useEmployeeByBranchId = (branchId) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["employeesByBranch", branchId],
    queryFn: () => apiGet(`/employee/branch/${branchId}`),
    enabled: !!branchId,
    onSuccess: () => {
      dispatch(clearError());
    },
    onError: (queryError) => {
      const message = queryError?.message || "Failed to fetch branch employees";
      dispatch(setError(message));
      showError(message);
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useEmployeeDashboard = () => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["employeeDashboard"],
    queryFn: () => apiGet("/employee/dashboard"),
    onSuccess: () => {
      dispatch(clearError());
    },
    onError: (queryError) => {
      const message = queryError?.message || "Failed to fetch dashboard data";
      dispatch(setError(message));
      showError(message);
    },
    staleTime: 1000 * 60 * 5,
  });
};
