import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import workspaceReducer from './slices/workspaceSlice';
import dashboardReducer from './slices/dashboardSlice';
import chartReducer from './slices/chartSlice';
import chatReducer from './slices/chatSlice';
import versionReducer from './slices/versionSlice';
import uploadReducer from './slices/uploadSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workspace: workspaceReducer,
    dashboard: dashboardReducer,
    chart: chartReducer,
    chat: chatReducer,
    version: versionReducer,
    upload: uploadReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
