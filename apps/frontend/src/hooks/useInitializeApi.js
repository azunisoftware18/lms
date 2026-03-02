import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setupApiInterceptors } from '../services/apiClient';

// Initialize API interceptors with Redux dispatch and router navigate
export const useInitializeApi = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setupApiInterceptors(dispatch, navigate);
  }, [dispatch, navigate]);
};

export default useInitializeApi;
