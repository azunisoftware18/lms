import { Link, Outlet } from 'react-router-dom';
import { useLogout } from '../features/auth/hooks/useLogout';
import { useAuth } from '../hooks/useAuth';

const MainLayout = () => {
  const { user } = useAuth();
  const { logout } = useLogout();

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <header
        style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          background: '#fff',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <nav style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/leads">Leads</Link>
          <Link to="/loans">Loans</Link>
          <Link to="/employees">Employees</Link>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>{user?.name || user?.email || 'User'}</span>
          <button type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>
      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
