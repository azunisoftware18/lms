import axios from 'axios'


const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
    withCredentials: true,
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config
    },
    (error) => Promise.reject(error)
)
api.interceptors.response.use(
    (response) => response,
    (error) => {
       if (error.response?.status === 401) {
      console.log("Unauthorized");
        // Optionally, you can also clear the token from localStorage
       }
        return Promise.reject(error)
    }
)

export default api