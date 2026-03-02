import { useSelector } from 'react-redux';

/**
 * Hook to check if user is currently authenticated
 * @returns {boolean} true if user is authenticated
 */
export const useIsAuthenticated = () => {
  return useSelector((state) => state.auth.isAuthenticated);
};

/**
 * Hook to get current user data
 * @returns {Object|null} User object or null if not authenticated
 */
export const useAuthUser = () => {
  return useSelector((state) => state.auth.user);
};

/**
 * Hook to get auth loading status
 * @returns {string} 'idle' | 'loading' | 'succeeded' | 'failed'
 */
export const useAuthStatus = () => {
  return useSelector((state) => state.auth.status);
};

/**
 * Hook to get auth error message
 * @returns {string|null} Error message or null
 */
export const useAuthError = () => {
  return useSelector((state) => state.auth.error);
};

/**
 * Combined hook for common auth checks
 * @returns {Object} { isAuthenticated, user, status, error, isLoading }
 */
export const useAuth = () => {
  const isAuthenticated = useIsAuthenticated();
  const user = useAuthUser();
  const status = useAuthStatus();
  const error = useAuthError();

  return {
    isAuthenticated,
    user,
    status,
    error,
    isLoading: status === 'loading',
  };
};

export default useAuth;
