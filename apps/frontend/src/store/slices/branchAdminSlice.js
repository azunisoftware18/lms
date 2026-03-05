import { createSlice } from "@reduxjs/toolkit";
import { setSelectedBranch } from "./branchSlice";

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