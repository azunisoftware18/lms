import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Card from '../../../components/ui/Card';
import LoginForm from '../components/LoginForm';
import { useLogin } from '../hooks/useLogin';

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, status, error } = useSelector((state) => state.auth);
  const loginMutation = useLogin();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = (credentials) => {
    loginMutation.mutate(credentials);
  };

  return (
    <div className="page" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <Card title="Login" subtitle="Use your LMS credentials to continue.">
        <LoginForm onSubmit={handleLogin} loading={status === 'loading'} error={error} />
      </Card>
    </div>
  );
};

export default LoginPage;
