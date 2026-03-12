import { createSlice } from "@reduxjs/toolkit";

const employeeSlice = createSlice({
    name: 'employee',
    initialState: {
        employees: [],
        meta: null,
        selectedEmployee: null,
        loading: false,
        error: null,
    },
    reducers: {
        // Set loading state
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
        // Set error state
        ,setError: (state, action) => {
            state.error = action.payload;
        }
        // Clear error
        ,clearError: (state) => {
            state.error = null;
        }
        // Set all employees
        ,setEmployees: (state, action) => {
            const payload = action.payload;

            if (Array.isArray(payload)) {
                state.employees = payload;
                state.meta = null;
            } else {
                state.employees = Array.isArray(payload?.data) ? payload.data : [];
                state.meta = payload?.meta ?? null;
            }

            state.loading = false;
            state.error = null;
        }
        // Set selected employee
        ,setSelectedEmployee: (state, action) => {
            state.selectedEmployee = action.payload;
        }
        // Clear selected employee
        ,clearSelectedEmployee: (state) => {
            state.selectedEmployee = null;
        }
        // Add employee to list
        ,addEmployee: (state, action) => {
            state.employees.push(action.payload);
        }
        // Update employee in list
        ,updateEmployeeInList: (state, action) => {
            const index = state.employees.findIndex(emp => emp.id === action.payload.id);
            if (index !== -1) {
                state.employees[index] = action.payload;
            }
        }
        // Remove employee from list
        ,removeEmployeeFromList: (state, action) => {
            state.employees = state.employees.filter(emp => emp.id !== action.payload);
        }
        // Reset employee state
        ,resetEmployees: (state) => {
            state.employees = [];
            state.meta = null;
            state.selectedEmployee = null;
            state.loading = false;
            state.error = null;
        }
    }
})

export const {
    setLoading,
    setError,
    clearError,
    setEmployees,
    setSelectedEmployee,
    clearSelectedEmployee,
    addEmployee,
    updateEmployeeInList,
    removeEmployeeFromList,
    resetEmployees,
} = employeeSlice.actions;


export default employeeSlice.reducer;
