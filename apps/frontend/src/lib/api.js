import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://31t76sg5-4000.inc1.devtunnels.ms/api',
    withCredentials: true, // Automatically sends cookies 
    })

api.interceptors.request.use(
    (config) => {
        // Get token from localStorage if available
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized
        if (error?.response?.status === 401) {
            // Clear auth data and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }

        // Handle 403 Forbidden
        if (error?.response?.status === 403) {
            console.error('Access forbidden');
        }

        // Handle network errors
        if (!error?.response) {
            console.error('Network error occurred');
        }

        return Promise.reject(error);
    }
)

export default api