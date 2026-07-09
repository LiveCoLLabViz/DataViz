// Central place to configure every backend endpoint.
// Point these at your existing backend - nothing here assumes a specific implementation.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000';

export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  workspaces: {
    list: '/workspaces',
    create: '/workspaces',
    detail: (id) => `/workspaces/${id}`,
    share: (id) => `/workspaces/${id}/share`,
  },
  dashboards: {
    list: (workspaceId) => `/workspaces/${workspaceId}/dashboards`,
    create: (workspaceId) => `/workspaces/${workspaceId}/dashboards`,
    detail: (id) => `/dashboards/${id}`,
    rename: (id) => `/dashboards/${id}/rename`,
  },
  charts: {
    list: (dashboardId) => `/dashboards/${dashboardId}/charts`,
    create: (dashboardId) => `/dashboards/${dashboardId}/charts`,
    update: (id) => `/charts/${id}`,
    delete: (id) => `/charts/${id}`,
  },
  chat: {
    history: (workspaceId) => `/workspaces/${workspaceId}/messages`,
  },
  versions: {
    list: (dashboardId) => `/dashboards/${dashboardId}/versions`,
    restore: (versionId) => `/versions/${versionId}/restore`,
    compare: (dashboardId) => `/dashboards/${dashboardId}/versions/compare`,
  },
  uploads: {
    file: '/uploads',
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
