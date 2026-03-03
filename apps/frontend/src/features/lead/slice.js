import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filters: {},
};

const leadSlice = createSlice({
  name: 'lead',
  initialState,
  reducers: {
    setLeadFilters: (state, action) => {
      state.filters = action.payload;
    },
    resetLeadFilters: (state) => {
      state.filters = {};
    },
  },
});

export const { setLeadFilters, resetLeadFilters } = leadSlice.actions;
export default leadSlice.reducer;
