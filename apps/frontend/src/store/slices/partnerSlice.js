import { createSlice } from "@reduxjs/toolkit";

const partnerSlice = createSlice({
  name: "partner",

  initialState: {
    selectedPartner: null,
    partners: [],
    meta: null,
    loading: false,
    error: null,
  },

  reducers: {
    setSelectedPartner: (state, action) => {
      state.selectedPartner = action.payload;
    },

    clearSelectedPartner: (state) => {
      state.selectedPartner = null;
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

    setPartners: (state, action) => {
      const payload = action.payload;
      // Normalize possible response shapes and guard against undefined (e.g., 304 responses)
      if (!payload) {
        state.partners = [];
        state.meta = null;
      } else if (Array.isArray(payload)) {
        state.partners = payload;
        state.meta = null;
      } else if (Array.isArray(payload.data)) {
        state.partners = payload.data;
        state.meta = payload.meta || null;
      } else if (Array.isArray(payload?.data?.data)) {
        // handle double-wrapped payloads
        state.partners = payload.data.data;
        state.meta = payload.data.meta || null;
      } else {
        state.partners = [];
        state.meta = null;
      }
      state.loading = false;
      state.error = null;
    },

    addPartner: (state, action) => {
      state.partners.push(action.payload);
      state.loading = false;
      state.error = null;
    },

    updatePartnerInList: (state, action) => {
      const index = state.partners.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.partners[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
  }
});

export const {
  setSelectedPartner,
  clearSelectedPartner,
  setLoading,
  setError,
  clearError,
  setPartners,
  addPartner,
  updatePartnerInList,
} = partnerSlice.actions;

export default partnerSlice.reducer;