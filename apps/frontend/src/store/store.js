import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import loanTypeReducer from './slices/loanTypeSlice'
import branchReducer from './slices/branchSlice'
import createBranchAdminReducer from './slices/branchAdminSlice'
import coApplicationReducer from './slices/coApplicationSlice'
import creditReportReducer from './slices/creditReportSlice'
import emiReducer from './slices/emiSlice'
import loanApplicationReducer from './slices/loanApplicationSlice'
import loanDraftReducer from './slices/loanDraftSlice'


export const store = configureStore({
  reducer: {
    auth: authReducer,
    loanTypes: loanTypeReducer,
    branch:branchReducer,
    branchAdmin: createBranchAdminReducer,
    coApplication: coApplicationReducer,
    creditReport: creditReportReducer,
    emi:emiReducer,
    loanApplication: loanApplicationReducer,
    loanDraft: loanDraftReducer,
}
})

export default store
