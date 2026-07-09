import axiosInstance from './axiosInstance';
import { ENDPOINTS } from '@/utils/constants';

const dashboardService = {
  getDashboards: (workspaceId) =>
    axiosInstance.get(ENDPOINTS.dashboards.list(workspaceId)).then((r) => r.data),
  createDashboard: (workspaceId, userId, payload) =>
    axiosInstance.post(ENDPOINTS.dashboards.create(workspaceId, userId), payload).then((r) => r.data),
  getDashboard: (id) => axiosInstance.get(ENDPOINTS.dashboards.detail(id)).then((r) => r.data),
  updateDashboard: (id, userId, payload) =>
    axiosInstance.put(ENDPOINTS.dashboards.update(id, userId), payload).then((r) => r.data),
  deleteDashboard: (id, userId) =>
    axiosInstance.delete(ENDPOINTS.dashboards.delete(id, userId)).then((r) => r.data),
  getDashboardVersions: (id) => 
    axiosInstance.get(ENDPOINTS.dashboards.versions(id)).then((r) => r.data),
};

export default dashboardService;