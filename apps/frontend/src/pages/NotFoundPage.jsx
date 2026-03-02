import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        textAlign: 'center',
        padding: '20px',
      }}
    >
      <div>
        <h1 style={{ fontSize: '48px', margin: '0 0 10px 0', color: '#333' }}>404</h1>
        <p style={{ fontSize: '18px', color: '#666', margin: '10px 0 30px 0' }}>
          Page not found
        </p>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#0056b3')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#007bff')}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
