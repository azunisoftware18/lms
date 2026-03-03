import { createBrowserRouter, Outlet } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../features/auth/pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProtectedRoute from '../components/routes/ProtectedRoute';
import PublicRoute from '../components/routes/PublicRoute';
import { useInitializeApi } from '../hooks/useInitializeApi';
import MainLayout from '../layouts/MainLayout';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import LeadListPage from '../features/lead/pages/LeadListPage';
import LoanListPage from '../features/loan/pages/LoanListPage';
import EmployeeListPage from '../features/employee/pages/EmployeeListPage';
import PartnerListPage from '../features/partner/pages/PartnerListPage';
import BranchListPage from '../features/branch/pages/BranchListPage';
import ReportsPage from '../features/reports/pages/ReportsPage';

// Root layout component that initializes API interceptors
const RootLayout = () => {
  useInitializeApi();
  return <Outlet />;
};

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/login',
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        element: (
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: '/',
            element: <HomePage />,
          },
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
          {
            path: '/leads',
            element: <LeadListPage />,
          },
          {
            path: '/loans',
            element: <LoanListPage />,
          },
          {
            path: '/employees',
            element: <EmployeeListPage />,
          },
          {
            path: '/partners',
            element: <PartnerListPage />,
          },
          {
            path: '/branches',
            element: <BranchListPage />,
          },
          {
            path: '/reports',
            element: <ReportsPage />,
          },
        ],
      },
      {
        path: '*',
        element: (
          <ProtectedRoute>
            <NotFoundPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
