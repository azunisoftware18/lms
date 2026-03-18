import { createSlice } from "@reduxjs/toolkit";

const branchSlice = createSlice({
  name: "branch",
  initialState: {
    branches: [],
    mainBranches: [],
    loading: false,
    error: null,
  },
  reducers: {
    setBranches: (state, action) => {
      state.branches = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
      state.error = null;
    },
    setMainBranches: (state, action) => {
      state.mainBranches = Array.isArray(action.payload) ? action.payload : [];
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = Boolean(action.payload);
    },
    setError: (state, action) => {
      state.error = action.payload || null;
    },
    clearError: (state) => {
      state.error = null;
    },
    addBranch: (state, action) => {
      if (action.payload) {
        state.branches.unshift(action.payload);
      }
      state.loading = false;
      state.error = null;
    },
    updateBranchInList: (state, action) => {
      const updatedBranch = action.payload;
      const index = state.branches.findIndex(
        (branch) => branch.id === updatedBranch?.id,
      );
      if (index !== -1) {
        state.branches[index] = updatedBranch;
      }
      state.loading = false;
      state.error = null;
    },
    removeBranchFromList: (state, action) => {
      const branchId = action.payload;
      state.branches = state.branches.filter(
        (branch) => branch.id !== branchId,
      );
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setBranches,
  setMainBranches,
  setLoading,
  setError,
  addBranch,
  updateBranchInList,
  removeBranchFromList,
  clearError,
} = branchSlice.actions;

export default branchSlice.reducer;
