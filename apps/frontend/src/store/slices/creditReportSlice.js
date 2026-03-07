import { createSlice } from "@reduxjs/toolkit";

const creditReportSlice = createSlice({
    name: 'creditReport',
    initialState: {
        creditReports: [],
        reportData: null,
        selectedReport: null,
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

        // Set all credit reports
        setCreditReports: (state, action) => {
            state.creditReports = action.payload;
            state.loading = false;
            state.error = null;
        },

        // Set report data
        setReportData: (state, action) => {
            state.reportData = action.payload;
            state.loading = false;
            state.error = null;
        },

        // Clear report data
        clearReportData: (state) => {
            state.reportData = null;
        },

        // Set selected report
        setSelectedReport: (state, action) => {
            state.selectedReport = action.payload;
        },

        // Clear selected report
        clearSelectedReport: (state) => {
            state.selectedReport = null;
        },

        // Add credit report to list
        addCreditReport: (state, action) => {
            state.creditReports.push(action.payload);
        },

        // Update credit report in list
        updateCreditReportInList: (state, action) => {
            const index = state.creditReports.findIndex(report => report.id === action.payload.id);
            if (index !== -1) {
                state.creditReports[index] = action.payload;
            }
        },

        // Remove credit report from list
        removeCreditReportFromList: (state, action) => {
            state.creditReports = state.creditReports.filter(report => report.id !== action.payload);
        },

        // Handle fetch error
        handleFetchError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Reset credit reports state
        resetCreditReports: (state) => {
            state.creditReports = [];
            state.reportData = null;
            state.selectedReport = null;
            state.loading = false;
            state.error = null;
        },
    }
});

export const {
    setLoading,
    setError,
    clearError,
    setCreditReports,
    setReportData,
    clearReportData,
    setSelectedReport,
    clearSelectedReport,
    addCreditReport,
    updateCreditReportInList,
    removeCreditReportFromList,
    handleFetchError,
    resetCreditReports,
} = creditReportSlice.actions;

export default creditReportSlice.reducer;