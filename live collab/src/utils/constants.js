// Central place to configure every backend endpoint.
// Point these at your existing backend - nothing here assumes a specific implementation.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000';

export const ENDPOINTS = {
  auth: {
    login: '/login',
    register: '/register',
    logout: '/logout',
    me: '/me', // Doesn't exist on backend but keeping if we add it
  },
  workspaces: {
    create: (userId) => `/api/workspace/create/${userId}`,
    detail: (workspaceId) => `/api/workspace/get/${workspaceId}`,
    delete: (workspaceId, userId) => `/api/workspace/delete/${workspaceId}/${userId}`,
    // The backend doesn't have a list all workspaces route, we'll need to mock it or assume one
    list: (userId) => `/api/workspace/getall/${userId}`,
  },
  dashboards: {
    create: (workspaceId, userId) => `/api/dashboard/create/${workspaceId}/${userId}`,
    list: (workspaceId) => `/api/dashboard/getdashboard/${workspaceId}`,
    detail: (dashboardId) => `/api/dashboard/getdashboard/${dashboardId}`,
    update: (dashboardId, userId) => `/api/dashboard/updatedashboard/${dashboardId}/${userId}`,
    delete: (dashboardId, userId) => `/api/dashboard/deletedashboard/${dashboardId}/${userId}`,
    versions: (dashboardId) => `/api/dashboard/getdashboardversion/${dashboardId}`,
  },
  charts: {
    create: (dashboardId, userId, datasetId) => `/api/chart/create/${dashboardId}/${userId}/${datasetId}`,
    detail: (chartId) => `/api/chart/get/${chartId}`,
    list: (dashboardId) => `/api/chart/getcharts/${dashboardId}`,
    update: (dashboardId, chartId) => `/api/chart/update/${dashboardId}/${chartId}`,
    delete: (dashboardId, chartId) => `/api/chart/delete/${dashboardId}/${chartId}`,
  },
  datasets: {
    upload: (workspaceId) => `/api/dataset/upload/${workspaceId}`,
    list: (workspaceId) => `/api/dataset/workspace/${workspaceId}`,
    detail: (datasetId) => `/api/dataset/dataset/${datasetId}`,
    delete: (datasetId) => `/api/dataset/delete/${datasetId}`,
  },
};

export const CHART_TYPES = [
  { id: 'bar', label: 'Bar Chart' },
  { id: 'line', label: 'Line Chart' },
  { id: 'pie', label: 'Pie Chart' },
  { id: 'donut', label: 'Donut Chart' },
  { id: 'histogram', label: 'Histogram' },
  { id: 'scatter', label: 'Scatter Chart' },
  { id: 'area', label: 'Area Chart' },
];

export const PERMISSION_LEVELS = ['Viewer', 'Editor', 'Owner'];

export const AGGREGATIONS = ['Sum', 'Average', 'Count', 'Min', 'Max'];

export const CHART_PALETTE = [
  '#4f46e5',
  '#0f9488',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#ec4899',
  '#84cc16',
];

export const SOCKET_EVENTS = {
  JOIN_WORKSPACE: 'workspace:join',
  LEAVE_WORKSPACE: 'workspace:leave',
  MEMBER_LIST: 'members:list',
  MEMBER_JOINED: 'members:joined',
  MEMBER_LEFT: 'members:left',
  CHAT_MESSAGE: 'chat:message',
  CHAT_TYPING: 'chat:typing',
  DASHBOARD_UPDATE: 'dashboard:update',
  CHART_UPDATE: 'chart:update',
};

export const DRAG_ITEM_TYPES = {
  COLUMN: 'COLUMN',
  CHART_CARD: 'CHART_CARD',
};