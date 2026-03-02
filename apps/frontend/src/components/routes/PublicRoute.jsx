import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Public route that redirects authenticated users away (e.g., login page)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, status } = useSelector((state) => state.auth);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for auth state to hydrate from localStorage
    if (status !== 'loading') {
      setIsReady(true);
    }
  }, [status]);

  if (!isReady) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          fontSize: '16px',
          color: '#666',
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  // If user is already authenticated, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
