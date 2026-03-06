import { createSlice } from "@reduxjs/toolkit";

const recoverySlice = createSlice({
  name: "recovery",

  initialState: {
    selectedRecoveryId: null,
    recoveries: [],
    recoveryDetails: null,
    loading: false,
    error: null,
  },

  reducers: {
    setSelectedRecovery: (state, action) => {
      state.selectedRecoveryId = action.payload;
    },

    clearSelectedRecovery: (state) => {
      state.selectedRecoveryId = null;
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

    setRecoveries: (state, action) => {
      state.recoveries = action.payload;
      state.loading = false;
      state.error = null;
    },

    setRecoveryDetails: (state, action) => {
      state.recoveryDetails = action.payload;
      state.loading = false;
      state.error = null;
    },
  }
});

export const {
  setSelectedRecovery,
  clearSelectedRecovery,
  setLoading,
  setError,
  clearError,
  setRecoveries,
  setRecoveryDetails,
} = recoverySlice.actions;

export default recoverySlice.reducer;