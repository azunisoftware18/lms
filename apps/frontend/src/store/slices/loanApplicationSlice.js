import { createSlice } from "@reduxjs/toolkit";

const loanApplicationSlice = createSlice({
    name: 'loanApplication',
    initialState: {
        loanApplications: [],
        selectedLoanApplication: null,
        loading: false,
        error: null,
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        setLoanApplications: (state, action) => {
            state.loanApplications = action.payload;
            state.loading = false;
            state.error = null;
        }
        ,setSelectedLoanApplication: (state, action) => {
            state.selectedLoanApplication = action.payload;
        },
            clearSelectedLoanApplication: (state) => {
            state.selectedLoanApplication = null;
        },
        setLoanApplication: (state, action) => {
            state.selectedLoanApplication = action.payload;
            state.loading = false;
            state.error = null;
        },
        addLoanApplication: (state, action) => {
            state.loanApplications.push(action.payload);
            state.loading = false;
            state.error = null;
        },
        updateLoanApplicationInList: (state, action) => {
            const index = state.loanApplications.findIndex(la => la.id === action.payload.id);
            if (index !== -1) {
                state.loanApplications[index] = action.payload;
            }
            state.loading = false;
            state.error = null;
        },
    }
});

export const {
    setLoading,
    setError,
    clearError,
    setLoanApplications,
    setSelectedLoanApplication,
    clearSelectedLoanApplication,
    setLoanApplication,
    addLoanApplication,
    updateLoanApplicationInList,
} = loanApplicationSlice.actions;

export default loanApplicationSlice.reducer;