import { createBrowserRouter } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../features/auth/pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProtectedRoute from '../components/routes/ProtectedRoute';
import PublicRoute from '../components/routes/PublicRoute';
import { useInitializeApi } from '../hooks/useInitializeApi';

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
        path: '/',
        element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
        ),
      },
      {
        path: '/login',
        element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
        ),
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
