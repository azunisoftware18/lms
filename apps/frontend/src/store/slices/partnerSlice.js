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
      if (Array.isArray(action.payload)) {
        state.partners = action.payload;
        state.meta = null;
      } else if (action.payload?.data) {
        state.partners = action.payload.data;
        state.meta = action.payload.meta || null;
      } else {
        state.partners = action.payload;
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