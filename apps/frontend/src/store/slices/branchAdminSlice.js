import { createSlice } from "@reduxjs/toolkit";

const branchAdminSlice = createSlice({
    name: 'branchAdmin',
    initialState: {
        selectAdmin:null,
    },
    reducers: {
        setSelectedBranchAdmin:(state,action)=>{
            state.selectAdmin = action.payload;
        },
        clearSelectedBranchAdmin:(state)=>{
            state.selectAdmin = null;
        }
    }
})

export const {setSelectedBranchAdmin, clearSelectedBranchAdmin} = branchAdminSlice.actions;
export default branchAdminSlice.reducer;