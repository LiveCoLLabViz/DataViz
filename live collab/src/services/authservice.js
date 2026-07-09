import axiosInstance from './axiosInstance';
import { ENDPOINTS } from '@/utils/constants';

export const login = (credentials) =>
  axiosInstance.post(ENDPOINTS.auth.login, credentials).then((r) => r.data);

export const register = (data) =>
  axiosInstance.post(ENDPOINTS.auth.register, data).then((r) => r.data);

export const logout = () => axiosInstance.post(ENDPOINTS.auth.logout).then((r) => r.data);

export const getCurrentUser = () => axiosInstance.get(ENDPOINTS.auth.me).then((r) => r.data);

const authService = { login, register, logout, getCurrentUser };

export default authService;