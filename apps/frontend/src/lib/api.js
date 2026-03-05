import axios from 'axios'


const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
    withCredentials: true, // Automatically sends cookies
})

api.interceptors.request.use(
    (config) => {
        // Cookies are automatically sent by browser with withCredentials: true
        return config
    },
    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (response) => response,
    (error) => {
       if (error.response?.status === 401) {
          console.log("Unauthorized - please login again");
          // Redirect to login or clear auth state here if needed
       }
        return Promise.reject(error)
    }
)

export default api