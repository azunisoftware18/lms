import { createSlice } from "@reduxjs/toolkit";

const technicalReportSlice = createSlice({
  name: "technicalReport",

  initialState: {
    selectedReportId: null,
    technicalReports: { data: [], meta: {} },
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
      // action.payload expected to be API response: { data: [], meta: {} } or an array
      const payload = action.payload;
      if (payload && payload.data) {
        state.technicalReports = {
          data: Array.isArray(payload.data) ? payload.data : [],
          meta: payload.meta || {},
        };
      } else if (Array.isArray(payload)) {
        state.technicalReports = { data: payload, meta: {} };
      } else {
        // fallback: empty
        state.technicalReports = { data: [], meta: {} };
      }
      state.loading = false;
      state.error = null;
    },

    addTechnicalReport: (state, action) => {
      if (!state.technicalReports || !Array.isArray(state.technicalReports.data)) {
        state.technicalReports = { data: [], meta: {} };
      }
      state.technicalReports.data.unshift(action.payload);
      state.loading = false;
      state.error = null;
    },

    updateTechnicalReportInList: (state, action) => {
      if (!state.technicalReports || !Array.isArray(state.technicalReports.data)) return;
      const index = state.technicalReports.data.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.technicalReports.data[index] = action.payload;
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