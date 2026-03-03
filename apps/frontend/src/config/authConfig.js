/**
 * Auth Configuration
 * Central place to manage all authentication-related settings
 */

export const authConfig = {
  // API endpoints
  api: {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
    loginEndpoint: '/auth/login',
    logoutEndpoint: '/auth/logout',
    getUserEndpoint: '/auth/me',
  },

  // LocalStorage keys
  storage: {
    userKey: 'auth_user',
    tokenKey: 'auth_token', // If needed for JWT in header
  },

  // Auth state constants
  status: {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCEEDED: 'succeeded',
    FAILED: 'failed',
  },

  // Toast configuration
  toast: {
    position: 'top-right',
    autoClose: 2500,
    newestOnTop: true,
  },

  // Route redirects
  redirects: {
    onLoginSuccess: '/', // Where to redirect after successful login
    onLoginFail: '/login', // Where to redirect on login failure
    onLogout: '/login', // Where to redirect after logout
    onSessionExpiry: '/login', // Where to redirect on 401 error
    onUnauthorized: '/login', // Where to redirect on 403 error
  },

  // API interceptor options
  interceptor: {
    handleSessionExpiry: true, // Auto logout on 401
    handleUnauthorized: true, // Handle 403
    handleServerError: true, // Show toast on 5xx errors
    retryFailedRequests: true,
    maxRetries: 1,
  },

  // Loading behavior
  loading: {
    showLoadingOnAuthCheck: true, // Show loading page while checking auth
    authCheckTimeoutMs: 5000, // Max time to wait for auth state
  },

  // Validation
  validation: {
    emailPattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
    minPasswordLength: 6,
  },
};

/**
 * Get email validation regex
 * @returns {RegExp} Email regex pattern
 */
export const getEmailRegex = () => {
  return new RegExp(authConfig.validation.emailPattern);
};

/**
 * Get API URL
 * @param {string} endpoint - Endpoint path (e.g., '/auth/login')
 * @returns {string} Full API URL
 */
export const getApiUrl = (endpoint) => {
  return `${authConfig.api.baseURL}${endpoint}`;
};

/**
 * Check if current environment is production
 * @returns {boolean}
 */
export const isProduction = () => {
  return import.meta.env.MODE === 'production';
};

/**
 * Check if current environment is development
 * @returns {boolean}
 */
export const isDevelopment = () => {
  return import.meta.env.MODE === 'development';
};

export default authConfig;
