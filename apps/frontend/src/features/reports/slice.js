import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filters: {},
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setReportsFilters: (state, action) => {
      state.filters = action.payload;
    },
    resetReportsFilters: (state) => {
      state.filters = {};
    },
  },
});

export const { setReportsFilters, resetReportsFilters } = reportsSlice.actions;
export default reportsSlice.reducer;
