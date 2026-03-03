import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filters: {},
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setEmployeeFilters: (state, action) => {
      state.filters = action.payload;
    },
    resetEmployeeFilters: (state) => {
      state.filters = {};
    },
  },
});

export const { setEmployeeFilters, resetEmployeeFilters } = employeeSlice.actions;
export default employeeSlice.reducer;
