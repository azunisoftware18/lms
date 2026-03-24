import { createSlice } from "@reduxjs/toolkit";

const leadSlice = createSlice({
    name: "lead",
    initialState: {
        leads: [],
        selectedLead: null,
        loading: false,
        error: null,
        pagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 1,
        },
        search: "",
    },
    reducers: {
        setLeads:(state, action)=> {
            state.leads = action.payload;
            state.loading = false;
            state.error = null;
        },
        setLeadPagination: (state, action) => {
            state.pagination = {
                ...state.pagination,
                ...action.payload,
            };
        },
        setLeadSearch: (state, action) => {
            state.search = action.payload;
        },
        setLoading:(state, action) => {
            state.loading = action.payload;
        },
        setError:(state, action) => {
            state.error = action.payload;
        },
        clearError:(state) => {
            state.error = null;
        },
        setSelectedLead:(state, action) => {
            state.selectedLead = action.payload;
        },
        clearSelectedLead:(state) => {
            state.selectedLead = null;
        },
        addLead:(state, action) => {
            state.leads.push(action.payload);
        },
        updateLeadInList:(state, action) => {
            const index = state.leads.findIndex(lead => lead.id === action.payload.id);
            if (index !== -1) {
                state.leads[index] = action.payload;
            }
        },
        removeLeadFromList:(state, action) => {
            state.leads = state.leads.filter(lead => lead.id !== action.payload);
        },
        resetLeads:(state) => {
            state.leads = [];
            state.selectedLead = null;
            state.loading = false;
            state.error = null;
            state.pagination = {
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 1,
            };
            state.search = "";
        },
    },
});

export const { setLeads, setLeadPagination, setLeadSearch, setLoading, setError, clearError, setSelectedLead, clearSelectedLead, addLead, updateLeadInList, removeLeadFromList, resetLeads } = leadSlice.actions;

export default leadSlice.reducer;