import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filters: {},
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDashboardFilters: (state, action) => {
      state.filters = action.payload;
    },
    resetDashboardFilters: (state) => {
      state.filters = {};
    },
  },
});

export const { setDashboardFilters, resetDashboardFilters } = dashboardSlice.actions;
export default dashboardSlice.reducer;
