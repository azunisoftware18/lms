import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useLogout } from '../features/auth/hooks/useLogout';

const HomePage = () => {
  const { logout } = useLogout();
  const { isAuthenticated, user, status } = useSelector((state) => state.auth);

  return (
    <div className="page">
      <h1>LMS Frontend</h1>
      <p>Auth status is managed in Redux and login API is handled by React Query.</p>

      <div style={{ marginTop: 16 }}>
        <p>
          <strong>Status:</strong> {status}
        </p>
        <p>
          <strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>User:</strong> {user?.fullName || '-'}
        </p>
      </div>

      {!isAuthenticated ? (
        <Link to="/login">Go to Login</Link>
      ) : (
        <button
          type="button"
          onClick={logout}
          style={{
            marginTop: 12,
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid #cbd5e1',
            background: '#fff',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default HomePage;
