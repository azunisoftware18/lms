import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import loanTypeReducer from './slices/loanTypeSlice'
import branchReducer from './slices/branchSlice'
import createBranchAdminReducer from './slices/branchAdminSlice'
import coApplicationReducer from './slices/coApplicationSlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    loanTypes: loanTypeReducer,
    branch:branchReducer,
    branchAdmin: createBranchAdminReducer,
    coApplication: coApplicationReducer,
  },
})


export default store
