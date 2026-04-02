
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import loanTypeReducer from "./slices/loanTypeSlice";
import branchReducer from "./slices/branchSlice";
import branchAdminReducer from "./slices/branchAdminSlice";
import coApplicationReducer from "./slices/coApplicationSlice";
import creditReportReducer from "./slices/creditReportSlice";
import emiReducer from "./slices/emiSlice";
import loanApplicationReducer from "./slices/loanApplicationSlice";
import loanDraftReducer from "./slices/loanDraftSlice";
import leadReducer from "./slices/leadSlice";
import employeeReducer from "./slices/employeeSlice";
import technicalReportReducer from "./slices/technicalReportSlice";
import sanctionReducer from "./slices/sanctionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loanTypes: loanTypeReducer,
    branch: branchReducer,
    branchAdmin: branchAdminReducer,
    coApplication: coApplicationReducer,
    creditReport: creditReportReducer,
    emi: emiReducer,
    loanApplication: loanApplicationReducer,
    loanDraft: loanDraftReducer,
    lead: leadReducer,
    employee: employeeReducer,
    technicalReport: technicalReportReducer,
    sanction: sanctionReducer,
  },
});

export default store;
