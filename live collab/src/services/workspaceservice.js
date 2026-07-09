import axiosInstance from './axiosInstance';
import { ENDPOINTS } from '@/utils/constants';

export const getWorkspaces = (userId) => axiosInstance.get(ENDPOINTS.workspaces.list(userId)).then((r) => r.data);

export const createWorkspace = (userId, payload) =>
  axiosInstance.post(ENDPOINTS.workspaces.create(userId), payload).then((r) => r.data);

export const getWorkspace = (id) => axiosInstance.get(ENDPOINTS.workspaces.detail(id)).then((r) => r.data);

export const deleteWorkspace = (workspaceId, userId) =>
  axiosInstance.delete(ENDPOINTS.workspaces.delete(workspaceId, userId)).then((r) => r.data);

// Using share from constants if it existed, but we didn't add it in our constants update. 
// Assuming it's not strictly required based on the backend API or we can mock it.
// We'll leave it as a mock or remove it. Let's remove it for now to stay aligned with the backend.

const workspaceService = {
  getWorkspaces,
  createWorkspace,
  getWorkspace,
  deleteWorkspace,
};

export default workspaceService;