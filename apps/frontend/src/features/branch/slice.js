import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filters: {},
};

const branchSlice = createSlice({
  name: 'branch',
  initialState,
  reducers: {
    setBranchFilters: (state, action) => {
      state.filters = action.payload;
    },
    resetBranchFilters: (state) => {
      state.filters = {};
    },
  },
});

export const { setBranchFilters, resetBranchFilters } = branchSlice.actions;
export default branchSlice.reducer;
