import { createSlice } from "@reduxjs/toolkit";

const loanAssignmentSlice = createSlice({
  name: "loanAssignment",

  initialState: {
    selectedLoan: null,
    assignedLoans: [],
    loading: false,
    error: null,
  },

  reducers: {
    setSelectedLoan: (state, action) => {
      state.selectedLoan = action.payload;
    },

    clearSelectedLoan: (state) => {
      state.selectedLoan = null;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    setAssignedLoans: (state, action) => {
      state.assignedLoans = action.payload;
      state.loading = false;
      state.error = null;
    },

    addAssignedLoan: (state, action) => {
      state.assignedLoans.push(action.payload);
      state.loading = false;
      state.error = null;
    },

    removeAssignedLoan: (state, action) => {
      state.assignedLoans = state.assignedLoans.filter(
        (loan) => loan.id !== action.payload
      );
      state.loading = false;
      state.error = null;
    },
  }
});

export const {
  setSelectedLoan,
  clearSelectedLoan,
  setLoading,
  setError,
  clearError,
  setAssignedLoans,
  addAssignedLoan,
  removeAssignedLoan,
} = loanAssignmentSlice.actions;

export default loanAssignmentSlice.reducer;