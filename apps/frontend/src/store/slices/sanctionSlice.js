import { createSlice } from "@reduxjs/toolkit";

const sanctionSlice = createSlice({
  name: "sanction",

  initialState: {
    selectedSanctionId: null,
    sanctions: { data: [], meta: {} },
    loading: false,
    error: null,
  },

  reducers: {
    setSelectedSanction: (state, action) => {
      state.selectedSanctionId = action.payload;
    },

    clearSelectedSanction: (state) => {
      state.selectedSanctionId = null;
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

    setSanctions: (state, action) => {
      const payload = action.payload;
      if (payload && payload.data) {
        state.sanctions = {
          data: Array.isArray(payload.data) ? payload.data : [],
          meta: payload.meta || {},
        };
      } else if (Array.isArray(payload)) {
        state.sanctions = { data: payload, meta: {} };
      } else {
        state.sanctions = { data: [], meta: {} };
      }
      state.loading = false;
      state.error = null;
    },

    addSanction: (state, action) => {
      if (!state.sanctions || !Array.isArray(state.sanctions.data)) {
        state.sanctions = { data: [], meta: {} };
      }
      state.sanctions.data.unshift(action.payload);
      state.loading = false;
      state.error = null;
    },

    updateSanctionInList: (state, action) => {
      if (!state.sanctions || !Array.isArray(state.sanctions.data)) return;
      const index = state.sanctions.data.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.sanctions.data[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setSelectedSanction,
  clearSelectedSanction,
  setLoading,
  setError,
  clearError,
  setSanctions,
  addSanction,
  updateSanctionInList,
} = sanctionSlice.actions;

export default sanctionSlice.reducer;
