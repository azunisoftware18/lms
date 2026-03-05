import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './privateRouter';
import PublicRoute from './publicRoute';

// Private pages
import DashboardPage from '../app/dashboard/DashboardPage';

// Public Pages
import HomePage from '../app/pubilc/HomePage';

export default function AppRoutes() {
	return (
		<Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <HomePage />
          </PublicRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
    </Routes>
	);
}
