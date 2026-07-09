import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chartType: 'bar',
  rows: [],
  columns: [],
  availableColumns: [],
  filters: [],
  colorScheme: '#3B82F6',
  showLegend: true,
  showTooltip: true,
  aggregation: 'sum',
  sort: 'none',
};

const chartSlice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    setChartType(state, action) {
      state.chartType = action.payload;
    },
    addFieldToWell(state, action) {
      const { well, field } = action.payload;
      if (!state[well].find((f) => f.id === field.id)) {
        state[well].push(field);
      }
    },
    removeFieldFromWell(state, action) {
      const { well, fieldId } = action.payload;
      state[well] = state[well].filter((f) => f.id !== fieldId);
    },
    setColorScheme(state, action) {
      state.colorScheme = action.payload;
    },
    toggleLegend(state) {
      state.showLegend = !state.showLegend;
    },
    toggleTooltip(state) {
      state.showTooltip = !state.showTooltip;
    },
    setAggregation(state, action) {
      state.aggregation = action.payload;
    },
    setSort(state, action) {
      state.sort = action.payload;
    },
    resetChartBuilder(state) {
      state.rows = [];
      state.columns = [];
      state.filters = [];
    },
    setDatasetColumns(state, action) {
      // action.payload = array of column name strings from the uploaded dataset
      state.availableColumns = action.payload;
    },
  },
});

export const {
  setChartType,
  addFieldToWell,
  removeFieldFromWell,
  setColorScheme,
  toggleLegend,
  toggleTooltip,
  setAggregation,
  setSort,
  resetChartBuilder,
  setDatasetColumns,
} = chartSlice.actions;
export default chartSlice.reducer;
