import { createSlice } from "@reduxjs/toolkit";

const legalReportSlice = createSlice({
  name: "legalReport",

  initialState: {
    selectedReportId: null,
    legalReports: [],
    loading: false,
    error: null,
  },

  reducers: {
    setSelectedReport: (state, action) => {
      state.selectedReportId = action.payload;
    },

    clearSelectedReport: (state) => {
      state.selectedReportId = null;
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

    setLegalReports: (state, action) => {
      state.legalReports = action.payload;
      state.loading = false;
      state.error = null;
    },

    addLegalReport: (state, action) => {
      state.legalReports.push(action.payload);
      state.loading = false;
      state.error = null;
    },

    updateLegalReportInList: (state, action) => {
      const index = state.legalReports.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.legalReports[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
  }
});

export const {
  setSelectedReport,
  clearSelectedReport,
  setLoading,
  setError,
  clearError,
  setLegalReports,
  addLegalReport,
  updateLegalReportInList,
} = legalReportSlice.actions;

export default legalReportSlice.reducer;