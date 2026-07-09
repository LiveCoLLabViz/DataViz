import axiosInstance from './axiosInstance';
import { ENDPOINTS } from '@/utils/constants';

export const getHistory = (workspaceId) =>
  axiosInstance.get(ENDPOINTS.chat.history(workspaceId)).then((r) => r.data);

export const sendMessage = (workspaceId, payload) =>
  axiosInstance.post(ENDPOINTS.chat.history(workspaceId), payload).then((r) => r.data);

const chatService = { getHistory, sendMessage };

export default chatService;