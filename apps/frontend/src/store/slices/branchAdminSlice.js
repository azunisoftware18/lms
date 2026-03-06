import { createSlice } from "@reduxjs/toolkit";

const branchAdminSlice = createSlice({
    name: 'branchAdmin',
    initialState: {
        branchAdmins: [],
        selectedAdmin: null,
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

        // Set all branch admins
        setBranchAdmins: (state, action) => {
            state.branchAdmins = action.payload;
            state.loading = false;
            state.error = null;
        },

        // Set selected branch admin
        setSelectedBranchAdmin: (state, action) => {
            state.selectedAdmin = action.payload;
        },

        // Clear selected branch admin
        clearSelectedBranchAdmin: (state) => {
            state.selectedAdmin = null;
        },

        // Add branch admin to list
        addBranchAdmin: (state, action) => {
            state.branchAdmins.push(action.payload);
        },

        // Update branch admin in list
        updateBranchAdminInList: (state, action) => {
            const index = state.branchAdmins.findIndex(admin => admin.id === action.payload.id);
            if (index !== -1) {
                state.branchAdmins[index] = action.payload;
            }
        },

        // Remove branch admin from list
        removeBranchAdminFromList: (state, action) => {
            state.branchAdmins = state.branchAdmins.filter(admin => admin.id !== action.payload);
        },

        // Handle fetch error
        handleFetchError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Reset branch admins state
        resetBranchAdmins: (state) => {
            state.branchAdmins = [];
            state.selectedAdmin = null;
            state.loading = false;
            state.error = null;
        },
    }
});

export const {
    setLoading,
    setError,
    clearError,
    setBranchAdmins,
    setSelectedBranchAdmin,
    clearSelectedBranchAdmin,
    addBranchAdmin,
    updateBranchAdminInList,
    removeBranchAdminFromList,
    handleFetchError,
    resetBranchAdmins,
} = branchAdminSlice.actions;

export default branchAdminSlice.reducer;