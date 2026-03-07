import { createSlice } from "@reduxjs/toolkit";

const branchSlice = createSlice({
  name: "branches",
  initialState: {
    selectedBranch: null,
  },
  reducers: {
    setSelectedBranch: (state, action) => {
      state.selectedBranch = action.payload;
    },
    clearSelectedBranch: (state) => {
      state.selectedBranch = null;
    },
  },
});

export const { setSelectedBranch, clearSelectedBranch } = branchSlice.actions;
export default branchSlice.reducer;
