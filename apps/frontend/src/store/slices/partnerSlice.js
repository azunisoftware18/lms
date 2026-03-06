import { createSlice } from "@reduxjs/toolkit";

const partnerSlice = createSlice({
  name: "partner",

  initialState: {
    selectedPartner: null,
    partners: [],
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
      state.partners = action.payload;
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