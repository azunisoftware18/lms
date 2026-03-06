import { createSlice } from "@reduxjs/toolkit";

const loanDefaultSlice = createSlice({
  name: "loanDefault",

  initialState: {
    selectedLoan: null,
    defaultedLoans: [],
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

    setDefaultedLoans: (state, action) => {
      state.defaultedLoans = action.payload;
      state.loading = false;
      state.error = null;
    },
  }
});

export const { setSelectedLoan, clearSelectedLoan, setLoading, setError, clearError, setDefaultedLoans } =
  loanDefaultSlice.actions;

export default loanDefaultSlice.reducer;