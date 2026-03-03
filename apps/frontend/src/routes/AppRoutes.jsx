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
			<PublicRoute>
				<Route path="/" element={<HomePage />} />
			</PublicRoute>

			<PrivateRoute>
				<Route path="/dashboard" element={<DashboardPage />} />
			</PrivateRoute>
		</Routes>
	);
}
