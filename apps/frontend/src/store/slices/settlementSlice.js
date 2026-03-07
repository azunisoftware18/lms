import { createSlice } from "@reduxjs/toolkit";

const settlementSlice = createSlice({
  name: "settlement",

  initialState: {
    selectedRecoveryId: null,
    settlements: [],
    payableAmount: null,
    loading: false,
    error: null,
  },

  reducers: {
    setSelectedSettlement: (state, action) => {
      state.selectedRecoveryId = action.payload;
    },

    clearSelectedSettlement: (state) => {
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

    setSettlements: (state, action) => {
      state.settlements = action.payload;
      state.loading = false;
      state.error = null;
    },

    setPayableAmount: (state, action) => {
      state.payableAmount = action.payload;
      state.loading = false;
      state.error = null;
    },
  }
});

export const {
  setSelectedSettlement,
  clearSelectedSettlement,
  setLoading,
  setError,
  clearError,
  setSettlements,
  setPayableAmount,
} = settlementSlice.actions;

export default settlementSlice.reducer;