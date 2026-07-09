import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit';
import dashboardService from '../../services/dashboardservice';
import chartService from '../../services/chartservice';

export const fetchDashboards = createAsyncThunk(
  'dashboard/fetchDashboards',
  async (workspaceId, { rejectWithValue }) => {
    try {
      return await dashboardService.getDashboards(workspaceId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createNewDashboard = createAsyncThunk(
  'dashboard/createDashboard',
  async ({ workspaceId, userId, name }, { rejectWithValue }) => {
    try {
      return await dashboardService.createDashboard(workspaceId, userId, { name });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// We'll also need a thunk to save a chart when dropped
export const createChartThunk = createAsyncThunk(
  'dashboard/createChart',
  async ({ dashboardId, userId, datasetId, payload }, { rejectWithValue }) => {
    try {
      return await chartService.createChart(dashboardId, userId, datasetId, payload);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const createHistorySnapshot = (state) => JSON.parse(JSON.stringify({
  dashboards: state.dashboards,
  activeDashboardId: state.activeDashboardId,
  zoom: state.zoom,
  alignment: state.alignment,
}));

const pushHistory = (state) => {
  state.past.push(createHistorySnapshot(state));
  state.future = [];
};

const initialState = {
  dashboards: [],
  activeDashboardId: null,
  zoom: 100,
  alignment: 'left',
  past: [],
  future: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    addDashboard: {
      reducer(state, action) {
        pushHistory(state);
        state.dashboards.push(action.payload);
        state.activeDashboardId = action.payload.id;
      },
      prepare({ name, workspaceId }) {
        const id = nanoid();
        return {
          payload: {
            id,
            workspaceId,
            name: name || `Dashboard ${Math.floor(Math.random() * 1000)}`,
            charts: [],
          },
        };
      },
    },
    renameDashboard(state, action) {
      pushHistory(state);
      const { id, name } = action.payload;
      const d = state.dashboards.find((d) => d.id === id);
      if (d) d.name = name;
    },
    closeDashboard(state, action) {
      pushHistory(state);
      const id = action.payload;
      //what is difference between state and action . state
      state.dashboards = state.dashboards.filter((d) => d.id !== id);
      if (state.activeDashboardId === id && state.dashboards.length) {
        state.activeDashboardId = state.dashboards[0].id;
      }

    },
    setActiveDashboard(state, action) {
      pushHistory(state);
      state.activeDashboardId = action.payload;
    },
    addChartToActiveDashboard(state, action) {
      pushHistory(state);
      const dash = state.dashboards.find((d) => d.id === state.activeDashboardId);
      if (dash) dash.charts.push(action.payload);
    },

    updateChart(state, action) {
      pushHistory(state);
      const { dashboardId, chartId, changes } = action.payload;
      const dash = state.dashboards.find((d) => d.id === dashboardId);
      if (!dash) return;
      const chart = dash.charts.find((c) => c.id === chartId);
      if (chart) Object.assign(chart, changes);
      //Object.assign is a method that copies the values of all enumerable own properties from one or more source objects to a target object.
      //  In this case, it is used to update the properties of the chart object with the changes provided in the action payload.
    },

    removeChart(state, action) {
      pushHistory(state);
      const { dashboardId, chartId } = action.payload;
      const dash = state.dashboards.find((d) => d.id === dashboardId);
      if (dash) dash.charts = dash.charts.filter((c) => c.id !== chartId);
    },


    duplicateChart(state, action) {
      pushHistory(state);
      const { dashboardId, chartId } = action.payload;
      const dash = state.dashboards.find((d) => d.id === dashboardId);
      if (!dash) return;
      const chart = dash.charts.find((c) => c.id === chartId);
      if (chart) {
        dash.charts.push({
          ...chart,
          id: nanoid(),
          position: { x: chart.position.x + 20, y: chart.position.y + 20 },
        });
      }
    },

    setZoom(state, action) {
      pushHistory(state);
      state.zoom = action.payload;
    },

    setAlignment(state, action) {
      pushHistory(state);
      state.alignment = action.payload;

      // Calculate available canvas width dynamically
      // Subtracting approx ~360px for the left sidebars (DataPanel + Collapsed Workspace Sidebar)
      const canvasWidth = window.innerWidth > 400 ? window.innerWidth - 360 : 800;

      state.dashboards.forEach((dash) => {
        dash.charts.forEach((chart) => {
          chart.position = chart.position || { x: 20, y: 20 };
          chart.size = chart.size || { width: 320, height: 240 };
          
          if (action.payload === 'center') {
            chart.position.x = Math.max(20, (canvasWidth / 2) - (chart.size.width / 2));
          } else if (action.payload === 'right') {
            chart.position.x = Math.max(20, canvasWidth - chart.size.width - 20);
          } else {
            // left alignment
            chart.position.x = 20; 
          }
        });
      });
    },
    //need to be looked at again


    undoHistory(state) {
      if (state.past.length === 0) return;
      state.future.push(createHistorySnapshot(state));
      const previous = state.past.pop();
      state.dashboards = previous.dashboards;
      state.activeDashboardId = previous.activeDashboardId;
      state.zoom = previous.zoom;
      state.alignment = previous.alignment;
    },
    redoHistory(state) {
      if (state.future.length === 0) return;
      state.past.push(createHistorySnapshot(state));
      const next = state.future.pop();
      state.dashboards = next.dashboards;
      state.activeDashboardId = next.activeDashboardId;
      state.zoom = next.zoom;
      state.alignment = next.alignment;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dashboards
      .addCase(fetchDashboards.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboards.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboards = action.payload.dashboards || action.payload || [];
        if (state.dashboards.length > 0 && !state.activeDashboardId) {
          state.activeDashboardId = state.dashboards[0]._id;
        }
      })
      .addCase(fetchDashboards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Dashboard
      .addCase(createNewDashboard.fulfilled, (state, action) => {
        const newDash = action.payload.dashboard || action.payload;
        state.dashboards.push(newDash);
        state.activeDashboardId = newDash._id;
      })
      // Create Chart
      .addCase(createChartThunk.fulfilled, (state, action) => {
        const { dashboardId, chart } = action.payload;
        const dash = state.dashboards.find((d) => d._id === dashboardId);
        if (dash) {
          dash.charts = dash.charts || [];
          dash.charts.push(chart);
        }
      });
  },
});

export const {
  addDashboard,
  renameDashboard,
  closeDashboard,
  setActiveDashboard,
  addChartToActiveDashboard,
  updateChart,
  removeChart,
  duplicateChart,
  setZoom,
  setAlignment,
  undoHistory,
  redoHistory,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
