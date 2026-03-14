import { createSlice } from "@reduxjs/toolkit";

const loanDraftSlice = createSlice({
  name: "loanDraft",
  initialState: {
    draft: null,
    submittedResult: null,
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setDraft: (state, action) => {
      state.draft = action.payload?.data ?? action.payload;
      state.loading = false;
      state.error = null;
    },
    setSubmittedResult: (state, action) => {
      state.submittedResult = action.payload?.data ?? action.payload;
      state.loading = false;
      state.error = null;
    },
    clearDraft: (state) => {
      state.draft = null;
      state.submittedResult = null;
    },
    resetLoanDraft: (state) => {
      state.draft = null;
      state.submittedResult = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setDraft,
  setSubmittedResult,
  clearDraft,
  resetLoanDraft,
} = loanDraftSlice.actions;

export default loanDraftSlice.reducer;
