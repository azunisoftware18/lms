import { createSlice } from "@reduxjs/toolkit";

const kycSlice = createSlice({
  name: "kyc",

  initialState: {
    kycs: [],
    meta: null,
    myKyc: null,
    selectedKyc: null,
    loading: false,
    error: null,
  },

  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    setKycs: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.kycs = action.payload;
        state.meta = null;
      } else if (action.payload?.data) {
        state.kycs = action.payload.data;
        state.meta = action.payload.meta || null;
      } else {
        state.kycs = action.payload;
        state.meta = null;
      }
      state.loading = false;
      state.error = null;
    },

    setMyKyc: (state, action) => {
      state.myKyc = action.payload;
      state.loading = false;
      state.error = null;
    },

    setSelectedKyc: (state, action) => {
      state.selectedKyc = action.payload;
    },

    clearSelectedKyc: (state) => {
      state.selectedKyc = null;
    },

    updateKycInList: (state, action) => {
      const index = state.kycs.findIndex((k) => k.id === action.payload.id);
      if (index !== -1) {
        state.kycs[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },

    resetKycs: (state) => {
      state.kycs = [];
      state.meta = null;
      state.myKyc = null;
      state.selectedKyc = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setKycs,
  setMyKyc,
  setSelectedKyc,
  clearSelectedKyc,
  updateKycInList,
  resetKycs,
} = kycSlice.actions;

export default kycSlice.reducer;
