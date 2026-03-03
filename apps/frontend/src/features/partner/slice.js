import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filters: {},
};

const partnerSlice = createSlice({
  name: 'partner',
  initialState,
  reducers: {
    setPartnerFilters: (state, action) => {
      state.filters = action.payload;
    },
    resetPartnerFilters: (state) => {
      state.filters = {};
    },
  },
});

export const { setPartnerFilters, resetPartnerFilters } = partnerSlice.actions;
export default partnerSlice.reducer;
