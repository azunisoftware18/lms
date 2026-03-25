import { createSlice } from "@reduxjs/toolkit";

const loanApplicationSlice = createSlice({
    name: 'loanApplication',
    initialState: {
        loanApplications: [],
        meta: null,
        selectedLoanApplication: null,
        loading: false,
        error: null,
        loanDocumentList: [],
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
            const payload = action.payload;
            if (Array.isArray(payload)) {
                state.loanApplications = payload;
                state.meta = null;
            } else {
                state.loanApplications = Array.isArray(payload?.data) ? payload.data : [];
                state.meta = payload?.meta ?? null;
            }
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
            state.selectedLoanApplication = action.payload?.data ?? action.payload;
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
        setLoanDocumentList: (state, action) => {
            state.loanDocumentList = action.payload;
            state.loading = false;
            state.error = null;
        },
        clearLoanDocumentList: (state) => {
            state.loanDocumentList = [];
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
    setLoanDocumentList,
    clearLoanDocumentList,
} = loanApplicationSlice.actions;

export default loanApplicationSlice.reducer;