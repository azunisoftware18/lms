import { createSlice } from "@reduxjs/toolkit";

const coApplicationSlice = createSlice({
    name: 'coApplication',
    initialState: {
        selectedCoApplicant:null,
    },
    reducers: {
        setSelectedCoApplicant:(state,action)=>{
            state.selectedCoApplicant = action.payload;
        }
        ,
        clearSelectedCoApplicant:(state)=>{
            state.selectedCoApplicant = null;
        }

    }
})


export const {
    setSelectedCoApplicant, clearSelectedCoApplicant
} = coApplicationSlice.actions;
export default coApplicationSlice.reducer;