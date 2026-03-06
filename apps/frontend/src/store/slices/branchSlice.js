import { createSlice } from '@reduxjs/toolkit';

const branchSlice = createSlice({
    name: 'branches',
    initialState: {
        branches: [],
        selectedBranch: null,
        mainBranches: [],
        loading: false,
        error: null,
    },
    reducers: {
        // Set loading state
        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        // Set error state
        setError: (state, action) => {
            state.error = action.payload;
        },

        // Clear error
        clearError: (state) => {
            state.error = null;
        },

        // Set all branches
        setBranches: (state, action) => {
            state.branches = action.payload;
            state.loading = false;
            state.error = null;
        },

        // Set main branches
        setMainBranches: (state, action) => {
            state.mainBranches = action.payload;
            state.error = null;
        },

        // Set selected branch
        setSelectedBranch: (state, action) => {
            state.selectedBranch = action.payload;
        },

        // Clear selected branch
        clearSelectedBranch: (state) => {
            state.selectedBranch = null;
        },

        // Add branch to list
        addBranch: (state, action) => {
            state.branches.push(action.payload);
        },

        // Update branch in list
        updateBranchInList: (state, action) => {
            const index = state.branches.findIndex(b => b.id === action.payload.id);
            if (index !== -1) {
                state.branches[index] = action.payload;
            }
        },

        // Remove branch from list
        removeBranchFromList: (state, action) => {
            state.branches = state.branches.filter(b => b.id !== action.payload);
        },

        // Handle fetch error
        handleFetchError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Reset branches state
        resetBranches: (state) => {
            state.branches = [];
            state.selectedBranch = null;
            state.mainBranches = [];
            state.loading = false;
            state.error = null;
        },
    }
});

export const {
    setLoading,
    setError,
    clearError,
    setBranches,
    setMainBranches,
    setSelectedBranch,
    clearSelectedBranch,
    addBranch,
    updateBranchInList,
    removeBranchFromList,
    handleFetchError,
    resetBranches,
} = branchSlice.actions;

export default branchSlice.reducer;
