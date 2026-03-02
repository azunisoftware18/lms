import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let dispatchRef = null;
let navigateRef = null;

// Setup interceptors with access to Redux dispatch and router navigate
export const setupApiInterceptors = (dispatch, navigate) => {
  dispatchRef = dispatch;
  navigateRef = navigate;

  // Response interceptor for handling 401 and other errors
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;

      if (status === 401) {
        // Session expired or unauthorized
        if (dispatchRef) {
          // Dispatch logout action if dispatch is available
          const { logout } = require('../features/auth/slice');
          dispatchRef(logout());
        }
        toast.info('Session expired. Please login again.');
        if (navigateRef) {
          navigateRef('/login');
        }
      } else if (status === 403) {
        toast.error('You do not have permission to access this resource.');
      } else if (status >= 500) {
        toast.error('Server error. Please try again later.');
      }

      return Promise.reject(error);
    }
  );
};

export default apiClient;

