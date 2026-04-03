import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  disbursements: [],
};

const disbursementSlice = createSlice({
  name: "disbursement",
  initialState,
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

    setDisbursements: (state, action) => {
      state.disbursements = action.payload;
    },

    addDisbursement: (state, action) => {
      state.disbursements.unshift(action.payload);
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setDisbursements,
  addDisbursement,
} = disbursementSlice.actions;

export default disbursementSlice.reducer;