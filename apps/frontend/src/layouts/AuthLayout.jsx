import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '20px' }}>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
