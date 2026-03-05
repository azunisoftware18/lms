import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlicce'
import loanTypeReducer from './slices/loanTypeSlice'
import branchReducer from './slices/branchSlice'
import branchAdminSlice from './slices/branchAdminSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loanTypes: loanTypeReducer,
    branch:branchReducer,
    branchAdmin: branchAdminSlice.reducer,
  },
})


export default store
