import axios from 'axios';
import { API_BASE_URL } from '@/utils/constants';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token automatically from local storage.
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && token !== 'null' && token !== 'undefined') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Central error handling - normalize error shape for callers.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Something went wrong. Please try again.';
    return Promise.reject({ ...error, message });
  }
);

export { axiosInstance };
export default axiosInstance;