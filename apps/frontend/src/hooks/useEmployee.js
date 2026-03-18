import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { apiGet, apiPost, apiPatch, apiDelete } from '../lib/api/apiClient';
import { showSuccess, showError } from '../lib/utils/toastService';
import { normalizeParams } from '../lib/utils/paramHelper';
import {
    setEmployees,
    setLoading,
    setError,
    addEmployee,
    updateEmployeeInList,
    removeEmployeeFromList,
    clearError,
} from '../store/slices/employeeSlice';
export const useEmployees = (params = {}) => {
    const dispatch = useDispatch();
    const employees = useSelector(state => state.employee.employees);
    const meta = useSelector(state => state.employee.meta);
    const loading = useSelector(state => state.employee.loading);
    const error = useSelector(state => state.employee.error);

    const normalizedParams = normalizeParams(params);

    const query = useQuery(['employees', normalizedParams], () =>
        apiGet('/employee/all', {
            params: normalizedParams,
        }), {
        keepPreviousData: true,
        onSuccess: (data) => {
            dispatch(setEmployees(data));
            dispatch(clearError());
        },
        onError: (queryError) => {
            const message = queryError?.message || 'Failed to fetch employees';
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

    return useQuery(
        ['employee', id],
        () => getEmployeeById(id),
        {
            enabled: !!id,
            onSuccess: (data) => {
                dispatch(clearError());
            },
            onError: (queryError) => {
                const message = queryError?.message || 'Failed to fetch employee';
                dispatch(setError(message));
                showError(message);
            },
            staleTime: 1000 * 60 * 5,
        }
    );
};

export const useCreateEmployee = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation((payload) => apiPost('/employee', payload), {
        onMutate: () => {
            dispatch(setLoading(true));
        },
        onSuccess: (data) => {
            dispatch(addEmployee(data));
            dispatch(setLoading(false));
            dispatch(clearError());
            queryClient.invalidateQueries(['employees']);
            showSuccess('Employee created successfully!');
        },
        onError: (mutationError) => {
            const message = mutationError?.message || 'Failed to create employee';
            dispatch(setError(message));
            dispatch(setLoading(false));
            showError(message);
        },
    });
};

export const useUpdateEmployee = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation(
        ({ id, data }) => apiPatch(`/employee/${id}`, data),
        {
            onMutate: () => {
                dispatch(setLoading(true));
            },
            onSuccess: (data) => {
                dispatch(updateEmployeeInList(data));
                dispatch(setLoading(false));
                dispatch(clearError());
                queryClient.invalidateQueries(['employees', 'employee']);
                showSuccess('Employee updated successfully!');
            },
            onError: (mutationError) => {
                const message = mutationError?.message || 'Failed to update employee';
                dispatch(setError(message));
                dispatch(setLoading(false));
                showError(message);
            },
        }
    );
};

export const useDeleteEmployee = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    return useMutation((id) => apiDelete(`/employee/${id}`), {
        onMutate: () => {
            dispatch(setLoading(true));
        },
        onSuccess: (_, id) => {
            dispatch(removeEmployeeFromList(id));
            dispatch(setLoading(false));
            dispatch(clearError());
            queryClient.invalidateQueries(['employees']);
            showSuccess('Employee deleted successfully!');
        },
        onError: (mutationError) => {
            const message = mutationError?.message || 'Failed to delete employee';
            dispatch(setError(message));
            dispatch(setLoading(false));
            showError(message);
        },
    });
};

export const useEmployeeByBranchId = (branchId) => {
    const dispatch = useDispatch();

    return useQuery(
        ['employeesByBranch', branchId],
        () => apiGet(`/employee/branch/${branchId}`),
        {
            enabled: !!branchId,
            onSuccess: (data) => {
                dispatch(clearError());
            },
            onError: (queryError) => {
                const message = queryError?.message || 'Failed to fetch branch employees';
                dispatch(setError(message));
                showError(message);
            },
            staleTime: 1000 * 60 * 5,
        }
    );
};

export const useEmployeeDashboard = () => {
    const dispatch = useDispatch();

    return useQuery(['employeeDashboard'], () => apiGet('/employee/dashboard'), {
        onSuccess: (data) => {
            dispatch(clearError());
        },
        onError: (queryError) => {
            const message = queryError?.message || 'Failed to fetch dashboard data';
            dispatch(setError(message));
            showError(message);
        },
        staleTime: 1000 * 60 * 5,
    });
};