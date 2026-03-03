import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filters: {},
};

const loanSlice = createSlice({
  name: 'loan',
  initialState,
  reducers: {
    setLoanFilters: (state, action) => {
      state.filters = action.payload;
    },
    resetLoanFilters: (state) => {
      state.filters = {};
    },
  },
});

export const { setLoanFilters, resetLoanFilters } = loanSlice.actions;
export default loanSlice.reducer;
