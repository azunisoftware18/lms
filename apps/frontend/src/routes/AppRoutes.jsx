import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './privateRouter';
import PublicRoute from './publicRoute';

// Private pages
import DashboardPage from '../app/dashboard/DashboardPage';
import ApplicationPage from '../app/dashboard/LOS/ApplicationPage.jsx';
import DocumentPage from '../app/dashboard/LOS/DocumentPage.jsx';
import BranchManagement from '../app/dashboard/Configuration/BranchManagement.jsx';
import BorrowerPage from '../app/dashboard/BorrowerPage.jsx';
import CreditCheckPage from '../app/dashboard/LOS/CreditCheckPage.jsx';
import TechnicalReviewPage from '../app/dashboard/LOS/TechnicalReviewPage.jsx';
import LegalCompliancePage from '../app/dashboard/LOS/LegalCompilancePage.jsx';
import EMIManagementPage from '../app/dashboard/LOS/EMIManagementPage.jsx';
import SanctionPage from '../app/dashboard/LOS/SanctionPage.jsx';
import DisbursementManagementPage from '../app/dashboard/LOS/DisbursementManagementPage.jsx';








// Public Pages
import Layout from '../layout/Layout.jsx';
import LoginForm from '../components/forms/LoginForm.jsx';
import AdminLayout from '../layout/AdminLayout.jsx';
import HomePage from '../app/public/HomePage.jsx';
import AboutUsPage from '../app/public/AboutUsPage.jsx';
import AnnualReportPage from '../app/public/AnnualReportPage.jsx';
import BoardOfDirectorsPage from '../app/public/BoardOfDirectorsPage.jsx';
import CommitteesPage from '../app/public/CommitteesPage.jsx';
import ContactUsPage from '../app/public/ContactUsPage.jsx';
import CorporateGovernancePage from '../app/public/CorporateGovernancePage.jsx';
import CsrPage from '../app/public/CsrPage.jsx';
import EmployeesBenefitPage from '../app/public/EmployeesBenefitPage.jsx';
import CreditRatingPage from '../app/public/CreditRatingPage.jsx';
import FinancialInformationPage from '../app/public/FinancialInformationPage.jsx';
import FinovaHrPage from '../app/public/FinovaHrPage.jsx';
import JointheFinovaFaimilyPage from '../app/public/JointheFinovaFaimilyPage.jsx';
import KMP from '../app/public/KeyManagerialPersonnelPage.jsx';
import NewsAndMediaPage from '../app/public/NewsAndMediaPage.jsx';
import NoticeOfBallotPage from '../app/public/NoticeOfBallotPage.jsx';
import OpportunityPage from '../app/public/OpportunityPage.jsx';
import OtherDisclosuresPage from '../app/public/OtherDisclosuresPage.jsx';
import OurInvestorsPage from '../app/public/OurInvestorsPage.jsx';
import OurMethodPage from '../app/public/OurMethodPage.jsx';
import PoliciesAndCodesPage from '../app/public/PoliciesAndCodesPage.jsx';
import PoliciesPage from '../app/public/PoliciesPage.jsx';
import ProductsPage from '../app/public/ProductsPage.jsx';
import PublicDisclosureUnderLiquidityRiskPage from '../app/public/PublicDisclosureUnderLiquidityRiskPage.jsx';
import SarfaesiAuctionNoticesPage from '../app/public/SarfaesiAuctionNoticesPage.jsx';
import ShareholderInformationPage from '../app/public/ShareholderInformationPage.jsx';
import VisionAndMissionPage from '../app/public/VisionAndMissionPage.jsx';
import WelcometoFinovaPage from '../app/public/WelcometoFinovaPage.jsx';
import UnderRegulationPage from '../app/public/UnderRegulationPage.jsx';
import LoanAccountCreation from '../app/dashboard/LMS/LoanAccountCreation.jsx';
import EMISchedule from '../app/dashboard/LMS/EMISchedule.jsx';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setUser } from '../store/slices/authSlice.js';
import RepaymentManagement from '../app/dashboard/LMS/RepaymentManagement.jsx';
import NachAutoDebit from '../app/dashboard/LMS/NachAutoDebit.jsx';
import DpdTracking from '../app/dashboard/LMS/DpdTracking.jsx';
import RecoveryManagement from '../app/dashboard/LMS/RecoveryManagement.jsx';
import Foreclosure from '../app/dashboard/LMS/Foreclosure.jsx';
import LoanClosure from '../app/dashboard/LMS/LoanClosure.jsx';
import LoanAccountView from '../app/dashboard/ViewDetail/LoanAccountView.jsx';
import KycVerificationPage from '../app/dashboard/LOS/KycVerificationPage.jsx';


export default function AppRoutes() {
	const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
    }
  }, [dispatch]);

	return (
		<Routes>
			{/* Public Layout */}
			<Route
				path="/"
				element={
					<PublicRoute>
						<Layout />
					</PublicRoute>
				}>
				{/* Public Page  */}
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
				{/* <Route path="sarfaesi-secured-assets" element={<SarfaesiPage />} /> */}
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

			{/* Private Dashboard */}
			<Route
				path="/admin"
				element={
					<PrivateRoute>
						<AdminLayout />
					</PrivateRoute>
				}>

				{/* Dashboard page */}
				<Route index element={<DashboardPage />} />
				<Route path='borrowers' element={< BorrowerPage />} />

				{/* LMS Pages */}
				<Route path="loan-account-creation" element={<LoanAccountCreation />} />
				<Route path="emi-schedule" element={<EMISchedule />} />
				<Route path="repayment-management" element={<RepaymentManagement />} />
				<Route path="nach-auto-debit" element={<NachAutoDebit />} />
				<Route path="dpd-tracking" element={<DpdTracking />} />
				<Route path="recovery-management" element={<RecoveryManagement />} />
				<Route path="foreclosure" element={<Foreclosure />} />
				<Route path="loan-closure" element={<LoanClosure />} />
				<Route path="branch-management" element={<BranchManagement />} />


				{/* LOS pages */}
				<Route path='los/applications' element={<ApplicationPage />} />
				<Route path='los/documents' element={<DocumentPage />} />
				<Route path='los/kyc-verification' element={<KycVerificationPage />} />
				<Route path='los/credit-check' element={<CreditCheckPage />} />
				<Route path='los/technical-review' element={<TechnicalReviewPage />} />
				<Route path='los/legal-compliance' element={<LegalCompliancePage />} />
				<Route path='los/emi-management' element={<EMIManagementPage />} />
				<Route path='los/sanction' element={<SanctionPage />} />
				<Route path='los/disbursement' element={<DisbursementManagementPage />} />
				
				

				{/* View Detail Pages */} 
				<Route path="loan-account-view/:loanId" element={<LoanAccountView />} />
			</Route>
		</Routes>
	);
}