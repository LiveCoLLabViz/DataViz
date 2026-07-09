import axiosInstance from './axiosInstance';
import { ENDPOINTS } from '@/utils/constants';

const versionService = {
  getVersions: (dashboardId) =>
    axiosInstance.get(ENDPOINTS.versions.list(dashboardId)).then((r) => r.data),
  restoreVersion: (versionId) =>
    axiosInstance.post(ENDPOINTS.versions.restore(versionId)).then((r) => r.data),
  compareVersions: (dashboardId, versionIds) =>
    axiosInstance
      .post(ENDPOINTS.versions.compare(dashboardId), { versionIds })
      .then((r) => r.data),
};

export default versionService;