import { createSlice } from "@reduxjs/toolkit";

const eligibilitySlice = createSlice({
  name: "eligibility",

  initialState: {
    selectedLoanId: null,
    eligibilityData: null,
    loading: false,
    error: null,
  },

  reducers: {
    setSelectedLoanId: (state, action) => {
      state.selectedLoanId = action.payload;
    },

    clearSelectedLoanId: (state) => {
      state.selectedLoanId = null;
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

    setEligibilityData: (state, action) => {
      state.eligibilityData = action.payload;
      state.loading = false;
      state.error = null;
    },
  }
});

export const {
  setSelectedLoanId,
  clearSelectedLoanId,
  setLoading,
  setError,
  clearError,
  setEligibilityData,
} = eligibilitySlice.actions;

export default eligibilitySlice.reducer;