import { createSlice } from "@reduxjs/toolkit";

const forecloseSlice = createSlice({
  name: "foreclose",

  initialState: {
    summary: null,
    foreClosure: null,
    loading: false,
    error: null,
  },

  reducers: {
    setSummary: (state, action) => {
      state.summary = action.payload;
      state.loading = false;
      state.error = null;
    },

    setForeClosure: (state, action) => {
      state.foreClosure = action.payload;
      state.loading = false;
      state.error = null;
    },

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

    clearForeclose: (state) => {
      state.summary = null;
      state.foreClosure = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setSummary,
  setForeClosure,
  setLoading,
  setError,
  clearError,
  clearForeclose,
} = forecloseSlice.actions;

export default forecloseSlice.reducer;
