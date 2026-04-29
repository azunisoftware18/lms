import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import PrivateRoute from "./privateRouter";
import PublicRoute from "./publicRoute";
import { setUser } from "../store/slices/authSlice.js";

// Private pages
import DashboardPage from "../app/dashboard/DashboardPage";
import ApplicationPage from "../app/dashboard/LOS/ApplicationPage.jsx";
import DocumentPage from "../app/dashboard/LOS/DocumentPage.jsx";
import BorrowerPage from "../app/dashboard/BorrowerPage.jsx";
import CreditCheckPage from "../app/dashboard/LOS/CreditCheckPage.jsx";
import TechnicalReviewPage from "../app/dashboard/LOS/TechnicalReviewPage.jsx";
import LegalCompliancePage from "../app/dashboard/LOS/LegalCompilancePage.jsx";
import SanctionPage from "../app/dashboard/LOS/SanctionPage.jsx";
import DisbursementManagementPage from "../app/dashboard/LOS/DisbursementManagementPage.jsx";
import KycVerificationPage from "../app/dashboard/LOS/KycVerificationPage.jsx";
import LeadsPage from "../app/dashboard/LOS/LeadsPage.jsx";

// LMS pages
import LoanAccountCreation from "../app/dashboard/LMS/LoanAccountCreation.jsx";
import EMIManagementPage from "../app/dashboard/LMS/EMIManagementPage.jsx";
import EMISchedule from "../app/dashboard/LOS/EMISchedule.jsx";
import RepaymentManagement from "../app/dashboard/LMS/RepaymentManagement.jsx";
import DefaultManagementPage from "../app/dashboard/LMS/DefaultManagementPage.jsx";
import NachAutoDebit from "../app/dashboard/LMS/NachAutoDebit.jsx";
import DpdTracking from "../app/dashboard/LMS/DpdTracking.jsx";
import RecoveryManagement from "../app/dashboard/LMS/RecoveryManagement.jsx";
import Foreclosure from "../app/dashboard/LMS/Foreclosure.jsx";
import LoanClosure from "../app/dashboard/LMS/LoanClosure.jsx";
import ViewEMIs from "../app/dashboard/LMS/viewemi.jsx";

// View detail pages
import LoanAccountView from "../app/dashboard/ViewDetail/LoanAccountView.jsx";

// System setting pages
import CompanyDetailsPage from "../app/dashboard/systemSetting/CompanyDetailsPage.jsx";
import LoanConfigurationPage from "../app/dashboard/systemSetting/LoanConfigrationPage.jsx";
import SecuritySettingPage from "../app/dashboard/systemSetting/SecuritySettingPage.jsx";
import PaymentSettingPage from "../app/dashboard/systemSetting/PaymentSettingPage.jsx";

// Public pages
import Layout from "../layout/Layout.jsx";
import LoginForm from "../components/forms/LoginForm.jsx";
import AdminLayout from "../layout/AdminLayout.jsx";
import HomePage from "../app/public/HomePage.jsx";
import AboutUsPage from "../app/public/AboutUsPage.jsx";
import AnnualReportPage from "../app/public/AnnualReportPage.jsx";
import BoardOfDirectorsPage from "../app/public/BoardOfDirectorsPage.jsx";
import CommitteesPage from "../app/public/CommitteesPage.jsx";
import ContactUsPage from "../app/public/ContactUsPage.jsx";
import CorporateGovernancePage from "../app/public/CorporateGovernancePage.jsx";
import CsrPage from "../app/public/CsrPage.jsx";
import EmployeesBenefitPage from "../app/public/EmployeesBenefitPage.jsx";
import CreditRatingPage from "../app/public/CreditRatingPage.jsx";
import FinancialInformationPage from "../app/public/FinancialInformationPage.jsx";
import FinovaHrPage from "../app/public/FinovaHrPage.jsx";
import JointheFinovaFaimilyPage from "../app/public/JointheFinovaFaimilyPage.jsx";
import KMP from "../app/public/KeyManagerialPersonnelPage.jsx";
import NewsAndMediaPage from "../app/public/NewsAndMediaPage.jsx";
import NoticeOfBallotPage from "../app/public/NoticeOfBallotPage.jsx";
import OpportunityPage from "../app/public/OpportunityPage.jsx";
import OtherDisclosuresPage from "../app/public/OtherDisclosuresPage.jsx";
import OurInvestorsPage from "../app/public/OurInvestorsPage.jsx";
import OurMethodPage from "../app/public/OurMethodPage.jsx";
import PoliciesAndCodesPage from "../app/public/PoliciesAndCodesPage.jsx";
import PoliciesPage from "../app/public/PoliciesPage.jsx";
import ProductsPage from "../app/public/ProductsPage.jsx";
import PublicDisclosureUnderLiquidityRiskPage from "../app/public/PublicDisclosureUnderLiquidityRiskPage.jsx";
import SarfaesiAuctionNoticesPage from "../app/public/SarfaesiAuctionNoticesPage.jsx";
import ShareholderInformationPage from "../app/public/ShareholderInformationPage.jsx";
import VisionAndMissionPage from "../app/public/VisionAndMissionPage.jsx";
import WelcometoFinovaPage from "../app/public/WelcometoFinovaPage.jsx";
import UnderRegulationPage from "../app/public/UnderRegulationPage.jsx";
// Configuration pages
import LoanProduct from "../app/dashboard/Configuration/LoanProduct.jsx";
import BranchManagement from "../app/dashboard/Configuration/BranchManagement.jsx";
import BranchAdmin from "../app/dashboard/Configuration/BranchAdmin.jsx";
import EmployeeAddPage from "../app/dashboard/Configuration/EmployeeAddPage.jsx";
import PartnerAddPage from "../app/dashboard/Configuration/PartnerAddPage.jsx";
import PartnerCreatePage from "../app/dashboard/Configuration/PartnerCreatePage.jsx";

// Reports pages
import DueListPage from "../app/dashboard/reports/DueListPage.jsx";
import NPAReportsPage from "../app/dashboard/reports/NPAReportsPage.jsx";
import CRCReportPage from "../app/dashboard/reports/CRCReportPage.jsx";
import CustomerAndBookingListPage from "../app/dashboard/reports/CustomerAndBookingListPage.jsx";
import SalesTargetAndAchievementPage from "../app/dashboard/reports/SalesTargetAndAchievementPage.jsx";
import DisbursCollectionPage from "../app/dashboard/reports/DisbursCollectionPage.jsx";
import PermissionManagementPage from "../app/dashboard/PermissionManagementPage.jsx";
import UserPermissionPage from "../app/dashboard/UserPermission.jsx";
import EligibilityPage from "../app/dashboard/LOS/EligibilityPage.jsx";
import CreditReportView from "../app/dashboard/LOS/CreditReportView.jsx";
import RoleManagement from "../app/dashboard/RoleManagement.jsx";
import LoginFee from "../app/dashboard/LOS/LoginFee.jsx";

// Accounting pages
import AccountMastersPage from "../app/dashboard/Accounting/AccountMastersPage.jsx";
import TransactionBooksPage from "../app/dashboard/Accounting/TransactionBooksPage.jsx";
import ProfitAndLossBalancesPage from "../app/dashboard/Accounting/ProfitAndLossBalancesPage.jsx";
import GSTDetailPage from "../app/dashboard/Accounting/GSTDetailPage.jsx";
import TopupRefundPage from "../app/dashboard/Accounting/TopupRefundPage.jsx";
import BalanceReportPage from "../app/dashboard/Accounting/BalanceReportPage.jsx";
import IMDAuthorizationPage from "../app/dashboard/Accounting/IMDAuthorizationPage.jsx";
import FinancialDashboardPage from "../app/dashboard/Accounting/ReconcileBankBalancePage.jsx";
import ReconcileBankBalancePage from "../app/dashboard/Accounting/ReconcileBankBalancePage.jsx";
import RecieptEntryPage from "../app/dashboard/Accounting/RecieptEntryPage.jsx";
import TrialBalancePage from "../app/dashboard/Accounting/TrialBalancePage.jsx";

export default function AppRoutes() {
  const dispatch = useDispatch();

  useEffect(() => {
  const storedUser = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (storedUser && token) {
    dispatch(
      setUser({
        user: JSON.parse(storedUser),
        isAuthenticated: true,
      })
    );
  }
}, [dispatch]);

  return (
    <Routes>
      // Public routes
      <Route
        path="/"
        element={
          <PublicRoute>
            <Layout />
          </PublicRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="about-us" element={<AboutUsPage />} />
        <Route path="annual-report" element={<AnnualReportPage />} />
        <Route path="board-of-directors" element={<BoardOfDirectorsPage />} />
        <Route path="committees" element={<CommitteesPage />} />
        <Route path="contact" element={<ContactUsPage />} />
        <Route
          path="corporate-governance"
          element={<CorporateGovernancePage />}
        />
        <Route path="credit-rating" element={<CreditRatingPage />} />
        <Route path="investor-relations" element={<CsrPage />} />
        <Route path="employee-benefits" element={<EmployeesBenefitPage />} />
        <Route
          path="financial-information"
          element={<FinancialInformationPage />}
        />
        <Route path="hr" element={<FinovaHrPage />} />
        <Route
          path="join-the-finova-family"
          element={<JointheFinovaFaimilyPage />}
        />
        <Route path="key-managerial-personnel" element={<KMP />} />
        <Route path="news-and-media" element={<NewsAndMediaPage />} />
        <Route path="notice-of-ballot" element={<NoticeOfBallotPage />} />
        <Route path="opportunity" element={<OpportunityPage />} />
        <Route path="other-disclosures" element={<OtherDisclosuresPage />} />
        <Route path="our-investors" element={<OurInvestorsPage />} />
        <Route path="our-method" element={<OurMethodPage />} />
        <Route path="policies-and-codes" element={<PoliciesAndCodesPage />} />
        <Route path="policies" element={<PoliciesPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route
          path="public-disclosure-under-liquidity-risk"
          element={<PublicDisclosureUnderLiquidityRiskPage />}
        />
        <Route
          path="sarfaesi-auction-notices"
          element={<SarfaesiAuctionNoticesPage />}
        />
        <Route
          path="shareholder-information"
          element={<ShareholderInformationPage />}
        />
        <Route
          path="disclosures-under-regulation-62-of-lodr"
          element={<UnderRegulationPage />}
        />
        <Route path="vision-and-mission" element={<VisionAndMissionPage />} />
        <Route path="welcome-to-finova" element={<WelcometoFinovaPage />} />
        <Route path="login" element={<LoginForm />} />
      </Route>
      // Admin routes
      {/* Employee routes */}
      <Route
        path="/employee"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route
          path="lms/default-management"
          element={<DefaultManagementPage />}
        />
      </Route>
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="borrowers" element={<BorrowerPage />} />
        <Route
          path="lms/loan-account-management"
          element={<LoanAccountCreation />}
        />
        <Route path="lms/emi-management" element={<EMIManagementPage />} />
        <Route path="lms/view-emis" element={<ViewEMIs />} />
        <Route
          path="lms/default-management"
          element={<DefaultManagementPage />}
        />
        <Route
          path="lms/repayment-management"
          element={<RepaymentManagement />}
        />
        <Route path="los/nach-auto-debit" element={<NachAutoDebit />} />
        <Route path="lms/dpd-tracking" element={<DpdTracking />} />
        <Route
          path="lms/recovery-management"
          element={<RecoveryManagement />}
        />
        <Route path="lms/foreclosure" element={<Foreclosure />} />
        <Route path="lms/loan-closure" element={<LoanClosure />} />
        <Route path="lms/branch-management" element={<BranchManagement />} />
        <Route path="lms/branch-admin" element={<BranchAdmin />} />
        // LOS routes
        <Route path="los/leads" element={<LeadsPage />} />
        <Route path="los/login-fee" element={<LoginFee />} />
        <Route path="los/applications" element={<ApplicationPage />} />
        <Route path="los/documents" element={<DocumentPage />} />
        <Route path="los/kyc-verification" element={<KycVerificationPage />} />
        <Route path="los/credit-check" element={<CreditCheckPage />} />
        <Route path="los/technical-review" element={<TechnicalReviewPage />} />
        <Route path="los/legal-compliance" element={<LegalCompliancePage />} />
        <Route path="los/sanction" element={<SanctionPage />} />
        <Route path="los/emi-schedule" element={<EMISchedule />} />
        <Route
          path="los/disbursement"
          element={<DisbursementManagementPage />}
        />
        <Route path="los/eligibility" element={<EligibilityPage />} />
        <Route
          path="los/credit-report/:loanId"
          element={<CreditReportView />}
        />
        <Route path="loan-account-view/:loanId" element={<LoanAccountView />} />
        <Route
          path="system-setting/company-details"
          element={<CompanyDetailsPage />}
        />
        <Route
          path="system-setting/loan-configuration"
          element={<LoanConfigurationPage />}
        />
        <Route
          path="system-setting/security-settings"
          element={<SecuritySettingPage />}
        />
        <Route
          path="system-setting/payment-settings"
          element={<PaymentSettingPage />}
        />
        {/* configuration routes  */}
        <Route path="loan-product" element={<LoanProduct />} />
        <Route path="branch-management" element={<BranchManagement />} />
        <Route path="branch-admin" element={<BranchAdmin />} />
        <Route path="employee" element={<EmployeeAddPage />} />
        <Route path="partner" element={<PartnerAddPage />} />
        <Route path="partner/add" element={<PartnerCreatePage />} />

        {/* Role management route */}
        <Route path="role-management" element={<RoleManagement />} />

        {/* reports routes */}
        <Route path="due-list" element={<DueListPage />} />
        <Route path="reports/npa-reports" element={<NPAReportsPage />} />
        <Route path="reports/crc-report" element={<CRCReportPage />} />
        <Route
          path="reports/disburs-collection"
          element={<DisbursCollectionPage />}
        />
        <Route
          path="reports/customer-and-booking-list"
          element={<CustomerAndBookingListPage />}
        />
        <Route
          path="reports/sales-target-and-achievement"
          element={<SalesTargetAndAchievementPage />}
        />

        {/* Permission managemnet route  */}
        <Route
          path="permission-management"
          element={<PermissionManagementPage />}
        />
        <Route
          path="permission-management/user/:userId"
          element={<UserPermissionPage />}
        />

        {/* Accounting routes */}
        <Route path="accounting/account-masters" element={<AccountMastersPage />} />
        <Route path="accounting/transaction-books" element={<TransactionBooksPage />} />
        <Route path="accounting/profit-loss-balances" element={<ProfitAndLossBalancesPage />} />
        <Route path="accounting/gst" element={<GSTDetailPage />} />
        <Route path="accounting/topup-refund" element={<TopupRefundPage />} />
        <Route path="accounting/balance-report" element={<BalanceReportPage />}/>
        <Route path="accounting/reconcile-bank-balance" element={<ReconcileBankBalancePage />} />
        <Route path="accounting/imd-authorization" element={<IMDAuthorizationPage />} />
        <Route path="accounting/receipt-entry" element={<RecieptEntryPage />} />
        <Route path="accounting/trial-balance" element={<TrialBalancePage />} />

      </Route>
    </Routes>
  );
}
