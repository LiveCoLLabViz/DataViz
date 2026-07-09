import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import workspaceService from '../../services/workspaceservice';
import { getDatasets } from '../../services/uploadservice';

export const fetchWorkspaces = createAsyncThunk(
  'workspace/fetchWorkspaces',
  async (userId, { rejectWithValue }) => {
    try {
      return await workspaceService.getWorkspaces(userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createNewWorkspace = createAsyncThunk(
  'workspace/createWorkspace',
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      return await workspaceService.createWorkspace(userId, data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteWorkspace = createAsyncThunk(
  'workspace/deleteWorkspace',
  async ({ workspaceId, userId }, { rejectWithValue }) => {
    try {
      await workspaceService.deleteWorkspace(workspaceId, userId);
      return workspaceId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchWorkspaceDatasets = createAsyncThunk(
  'workspace/fetchDatasets',
  async (workspaceId, { rejectWithValue }) => {
    try {
      return await getDatasets(workspaceId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  workspaces: [],
  activeWorkspaceId: null,
  expandedNodes: {},
  loading: false,
  error: null,
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setActiveWorkspace(state, action) {
      state.activeWorkspaceId = action.payload;
    },
    toggleNodeExpanded(state, action) {
      const id = action.payload;
      state.expandedNodes[id] = !state.expandedNodes[id];
    },
    addFileToWorkspace(state, action) {
      const { workspaceId, file } = action.payload;
      const ws = state.workspaces.find((w) => w._id === workspaceId || w.id === workspaceId);
      if (ws) {
        ws.files = ws.files || [];
        ws.files.push(file);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchWorkspaces.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        state.loading = false;
        // Adjust depending on if backend returns array or { data: [] }
        state.workspaces = action.payload.workspaces || action.payload || [];
        if (state.workspaces.length > 0 && !state.activeWorkspaceId) {
          state.activeWorkspaceId = state.workspaces[0]._id;
        }
      })
      .addCase(fetchWorkspaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createNewWorkspace.fulfilled, (state, action) => {
        const newWs = action.payload.workspace || action.payload;
        state.workspaces.unshift(newWs);
        state.activeWorkspaceId = newWs._id;
      })
      // Delete
      .addCase(deleteWorkspace.fulfilled, (state, action) => {
        const deletedId = String(action.payload);
        state.workspaces = state.workspaces.filter((w) => {
          const wId = String(w._id || w.id);
          return wId !== deletedId;
        });
        if (String(state.activeWorkspaceId) === deletedId) {
          const firstWs = state.workspaces[0];
          state.activeWorkspaceId = firstWs ? (firstWs._id || firstWs.id) : null;
        }
      })
      // Fetch Datasets
      .addCase(fetchWorkspaceDatasets.fulfilled, (state, action) => {
        const workspaceId = action.meta.arg;
        const ws = state.workspaces.find((w) => w._id === workspaceId || w.id === workspaceId);
        if (ws) {
          ws.files = action.payload.datasets || action.payload || [];
        }
      });
  },
});

export const {
  setActiveWorkspace,
  toggleNodeExpanded,
  addFileToWorkspace,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
