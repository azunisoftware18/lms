import { createSlice } from '@reduxjs/toolkit';

const loanTypeSlice = createSlice({
  name: 'loanType',
  initialState: {
    loanTypes: [],
    selectedLoanType: null,
    loading: false,
    error: null,
  },
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
    setLoanTypes: (state, action) => {
      state.loanTypes = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedLoanType: (state, action) => {
      state.selectedLoanType = action.payload;
    },
    clearSelectedLoanType: (state) => {
      state.selectedLoanType = null;
    },
    addLoanType: (state, action) => {
      state.loanTypes.push(action.payload);
    },
    updateLoanTypeInList: (state, action) => {
      const index = state.loanTypes.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.loanTypes[index] = action.payload;
      }
    },
    removeLoanTypeFromList: (state, action) => {
      state.loanTypes = state.loanTypes.filter((item) => item.id !== action.payload);
    },
    resetLoanTypes: (state) => {
      state.loanTypes = [];
      state.selectedLoanType = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setLoanTypes,
  setSelectedLoanType,
  clearSelectedLoanType,
  addLoanType,
  updateLoanTypeInList,
  removeLoanTypeFromList,
  resetLoanTypes,
} = loanTypeSlice.actions;

export default loanTypeSlice.reducer;