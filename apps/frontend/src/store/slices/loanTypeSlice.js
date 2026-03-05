import {createSlice} from '@reduxjs/toolkit';

const loanTypeSlice = createSlice({
  name: 'loanType',
  initialState: {
    selectedLoanType: null,
  },
  reducers: {
    setSelectedLoanType: (state,action)=>{
      state.selectedLoanType = action.payload;
    },
    clearSelectedLoanType: (state,action)=>{
      state.selectedLoanType = null;
    }
  }
});

export const {setSelectedLoanType,clearSelectedLoanType} = loanTypeSlice.actions;
export default loanTypeSlice.reducer;