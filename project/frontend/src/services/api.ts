import axios, { AxiosError } from 'axios';
import { store } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { addToast } from '@/store/slices/uiSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  config => {
    // Add auth token from localStorage if available
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const { response, config } = error;
    
    if (response?.status === 401) {
      // Try to refresh token
      try {
        const refreshResponse = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        
        if (refreshResponse.data.accessToken) {
          localStorage.setItem('accessToken', refreshResponse.data.accessToken);
          // Retry original request
          if (config) {
            config.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
            return apiClient.request(config);
          }
        }
      } catch {
        // Refresh failed, logout user
        store.dispatch(logout());
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }

    // Handle other errors
    if (response?.status >= 500) {
      store.dispatch(
        addToast({
          type: 'error',
          title: 'Server Error',
          message: 'Something went wrong on our end. Please try again later.',
        })
      );
    }

    return Promise.reject(error);
  }
);

export default apiClient;