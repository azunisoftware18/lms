import { createSlice } from "@reduxjs/toolkit";

const technicalReportSlice = createSlice({
  name: "technicalReport",

  initialState: {
    selectedReportId: null,
    technicalReports: [],
    loading: false,
    error: null,
  },

  reducers: {
    setSelectedTechnicalReport: (state, action) => {
      state.selectedReportId = action.payload;
    },

    clearSelectedTechnicalReport: (state) => {
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

    setTechnicalReports: (state, action) => {
      state.technicalReports = action.payload;
      state.loading = false;
      state.error = null;
    },

    addTechnicalReport: (state, action) => {
      state.technicalReports.push(action.payload);
      state.loading = false;
      state.error = null;
    },

    updateTechnicalReportInList: (state, action) => {
      const index = state.technicalReports.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.technicalReports[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
  }
});

export const {
  setSelectedTechnicalReport,
  clearSelectedTechnicalReport,
  setLoading,
  setError,
  clearError,
  setTechnicalReports,
  addTechnicalReport,
  updateTechnicalReportInList,
} = technicalReportSlice.actions;

export default technicalReportSlice.reducer;