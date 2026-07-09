import axiosInstance from './axiosInstance';
import { ENDPOINTS } from '@/utils/constants';

const chartService = {
  getCharts: (dashboardId) =>
    axiosInstance.get(ENDPOINTS.charts.list(dashboardId)).then((r) => r.data),
  createChart: (dashboardId, userId, datasetId, payload) =>
    axiosInstance.post(ENDPOINTS.charts.create(dashboardId, userId, datasetId), payload).then((r) => r.data),
  getChart: (chartId) => 
    axiosInstance.get(ENDPOINTS.charts.detail(chartId)).then((r) => r.data),
  updateChart: (dashboardId, chartId, payload) =>
    axiosInstance.put(ENDPOINTS.charts.update(dashboardId, chartId), payload).then((r) => r.data),
  deleteChart: (dashboardId, chartId) => 
    axiosInstance.delete(ENDPOINTS.charts.delete(dashboardId, chartId)).then((r) => r.data),
};

export default chartService;