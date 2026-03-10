import { createSlice } from "@reduxjs/toolkit";

const emiSlice = createSlice({
    name: 'emi',
    initialState: {
        emis: [],
        meta: null,
        selectedEmi: null,
        emiSchedule: null,
        payableAmount: null,
        calculatedEmi: null,
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

        // Set all EMIs
        setEmis: (state, action) => {
            if (Array.isArray(action.payload)) {
                state.emis = action.payload;
                state.meta = null;
            } else if (action.payload?.data) {
                state.emis = action.payload.data;
                state.meta = action.payload.meta || null;
            } else {
                state.emis = action.payload;
                state.meta = null;
            }
            state.loading = false;
            state.error = null;
        },

        // Set selected EMI
        setSelectedEmi: (state, action) => {
            state.selectedEmi = action.payload;
        },

        // Clear selected EMI
        clearSelectedEmi: (state) => {
            state.selectedEmi = null;
        },

        // Set EMI schedule
        setEmiSchedule: (state, action) => {
            state.emiSchedule = action.payload;
            state.loading = false;
            state.error = null;
        },

        // Set payable amount
        setPayableAmount: (state, action) => {
            state.payableAmount = action.payload;
        },

        // Set calculated EMI
        setCalculatedEmi: (state, action) => {
            state.calculatedEmi = action.payload;
            state.loading = false;
            state.error = null;
        },

        // Add EMI to list
        addEmi: (state, action) => {
            state.emis.push(action.payload);
        },

        // Update EMI in list
        updateEmiInList: (state, action) => {
            const index = state.emis.findIndex(emi => emi.id === action.payload.id);
            if (index !== -1) {
                state.emis[index] = action.payload;
            }
        },

        // Remove EMI from list
        removeEmiFromList: (state, action) => {
            state.emis = state.emis.filter(emi => emi.id !== action.payload);
        },

        // Handle fetch error
        handleFetchError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Reset EMIs state
        resetEmis: (state) => {
            state.emis = [];
            state.meta = null;
            state.selectedEmi = null;
            state.emiSchedule = null;
            state.payableAmount = null;
            state.calculatedEmi = null;
            state.loading = false;
            state.error = null;
        },
    }
});

export const {
    setLoading,
    setError,
    clearError,
    setEmis,
    setSelectedEmi,
    clearSelectedEmi,
    setEmiSchedule,
    setPayableAmount,
    setCalculatedEmi,
    addEmi,
    updateEmiInList,
    removeEmiFromList,
    handleFetchError,
    resetEmis,
} = emiSlice.actions;

export default emiSlice.reducer;
