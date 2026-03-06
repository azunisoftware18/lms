import { createSlice } from "@reduxjs/toolkit";

const coApplicationSlice = createSlice({
    name: 'coApplication',
    initialState: {
        coApplicants: [],
        selectedCoApplicant: null,
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

        // Set all co-applicants
        setCoApplicants: (state, action) => {
            state.coApplicants = action.payload;
            state.loading = false;
            state.error = null;
        },

        // Set selected co-applicant
        setSelectedCoApplicant: (state, action) => {
            state.selectedCoApplicant = action.payload;
        },

        // Clear selected co-applicant
        clearSelectedCoApplicant: (state) => {
            state.selectedCoApplicant = null;
        },

        // Add co-applicant to list
        addCoApplicant: (state, action) => {
            state.coApplicants.push(action.payload);
        },

        // Update co-applicant in list
        updateCoApplicantInList: (state, action) => {
            const index = state.coApplicants.findIndex(ca => ca.id === action.payload.id);
            if (index !== -1) {
                state.coApplicants[index] = action.payload;
            }
        },

        // Remove co-applicant from list
        removeCoApplicantFromList: (state, action) => {
            state.coApplicants = state.coApplicants.filter(ca => ca.id !== action.payload);
        },

        // Handle fetch error
        handleFetchError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Reset co-applicants state
        resetCoApplicants: (state) => {
            state.coApplicants = [];
            state.selectedCoApplicant = null;
            state.loading = false;
            state.error = null;
        },
    }
});

export const {
    setLoading,
    setError,
    clearError,
    setCoApplicants,
    setSelectedCoApplicant,
    clearSelectedCoApplicant,
    addCoApplicant,
    updateCoApplicantInList,
    removeCoApplicantFromList,
    handleFetchError,
    resetCoApplicants,
} = coApplicationSlice.actions;

export default coApplicationSlice.reducer;