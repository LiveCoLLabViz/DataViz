import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiInfo, FiChevronUp, FiChevronDown, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import FieldWell from './FieldWell';
import ChartTypeSelector from './ChartTypeSelector';
import {
  setColorScheme, toggleLegend, toggleTooltip, setAggregation, setSort,
} from '../../redux/slices/chartSlice';
import { addDashboard, addChartToActiveDashboard } from '../../redux/slices/dashboardSlice';
import { buildChartData } from '../DashboardCanvas/DashboardCanvas';
import { FiBarChart2 } from 'react-icons/fi';
import './DataPanel.css';

const AGGREGATIONS = ['Select aggregation', 'sum', 'average', 'count', 'min', 'max'];
const SORTS = ['Select sort', 'ascending', 'descending'];

export default function DataPanel() {
  const dispatch = useDispatch();
  const {
    rows, columns, colorScheme, showLegend, showTooltip, aggregation, sort, chartType, filters
  } = useSelector((state) => state.chart);

  const activeWorkspaceId = useSelector((state) => state.workspace.activeWorkspaceId);
  const activeDashboardId = useSelector((state) => state.dashboard.activeDashboardId);
  const dashboards = useSelector((state) => state.dashboard.dashboards);

  const [sections, setSections] = useState({
    fields: true,
    chartSettings: true,
    filters: false,
    advanced: false,
  });

  const toggleSection = (section) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleAddDashboard = () => {
    const name = window.prompt('Dashboard name');
    if (name) {
      if (!activeWorkspaceId) {
        toast.error('Please select or create a workspace first');
        return;
      }
      dispatch(addDashboard({ name, workspaceId: activeWorkspaceId }));
      toast.success(`Dashboard "${name}" created`);
    }
  };

  const handleCreateChart = () => {
    if (!activeDashboardId) {
      toast.error('Please select or create a dashboard first');
      return;
    }
    if (columns.length === 0 && rows.length === 0) {
      toast.error('Please add fields to COLUMN or ROW first');
      return;
    }

    const title = columns[0]?.name || rows[0]?.name || 'New Chart';
    const dash = dashboards.find((d) => d.id === activeDashboardId || d._id === activeDashboardId);
    const existingCount = dash && dash.charts ? dash.charts.length : 0;
    
    const COLUMNS = 2;
    const CHART_WIDTH = 320;
    const CHART_HEIGHT = 240;
    const PADDING_X = 20;
    const PADDING_Y = 20;
    
    const col = existingCount % COLUMNS;
    const row = Math.floor(existingCount / COLUMNS);
    
    const posX = PADDING_X + col * (CHART_WIDTH + PADDING_X);
    const posY = PADDING_Y + row * (CHART_HEIGHT + PADDING_Y);

    dispatch(addChartToActiveDashboard({
      id: `chart-${Date.now()}`,
      title,
      chartType,
      color: colorScheme,
      showLegend,
      showTooltip,
      data: buildChartData({ rows, columns, filters: filters || [], aggregation, sort }),
      position: { x: posX, y: posY },
      size: { width: CHART_WIDTH, height: CHART_HEIGHT },
    }));

    toast.success('Chart created on dashboard!');
  };

  return (
    <section className="data-panel">
      <div className="data-panel__scroll">
        {/* FIELDS SECTION */}
        <div className="data-panel__section">
          <div className="data-panel__section-header" onClick={() => toggleSection('fields')}>
            <div className="header-title">
              FIELDS <FiInfo className="info-icon" />
            </div>
            {sections.fields ? <FiChevronUp /> : <FiChevronDown />}
          </div>
          {sections.fields && (
            <div className="data-panel__section-content">
              <FieldWell label="COLUMN" wellKey="columns" fields={columns} />
              <FieldWell label="ROW" wellKey="rows" fields={rows} />
            </div>
          )}
        </div>

        {/* CHART SETTINGS SECTION */}
        <div className="data-panel__section">
          <div className="data-panel__section-header" onClick={() => toggleSection('chartSettings')}>
            <div className="header-title">CHART SETTINGS</div>
            {sections.chartSettings ? <FiChevronUp /> : <FiChevronDown />}
          </div>
          {sections.chartSettings && (
            <div className="data-panel__section-content">
              <div className="data-panel__row vertical">
                <label>Chart Type</label>
                <ChartTypeSelector />
              </div>

              <div className="data-panel__row">
                <label>Color</label>
                <div className="color-picker-wrapper">
                  <div className="color-swatch" style={{ background: colorScheme || '#4F46E5' }}></div>
                  <input
                    type="color"
                    value={colorScheme}
                    onChange={(e) => dispatch(setColorScheme(e.target.value))}
                    className="hidden-color-input"
                  />
                  <FiChevronDown />
                </div>
              </div>

              <div className="data-panel__row">
                <label>Legend</label>
                <div className={`toggle-switch ${showLegend ? 'active' : ''}`} onClick={() => dispatch(toggleLegend())}>
                  <div className="toggle-knob"></div>
                </div>
              </div>

              <div className="data-panel__row">
                <label>Tooltip</label>
                <div className={`toggle-switch ${showTooltip ? 'active' : ''}`} onClick={() => dispatch(toggleTooltip())}>
                  <div className="toggle-knob"></div>
                </div>
              </div>

              <div className="data-panel__row vertical">
                <label>Aggregation</label>
                <select value={aggregation} onChange={(e) => dispatch(setAggregation(e.target.value))}>
                  {AGGREGATIONS.map((a) => <option key={a} value={a === 'Select aggregation' ? '' : a}>{a}</option>)}
                </select>
              </div>

              <div className="data-panel__row vertical">
                <label>Sort</label>
                <select value={sort} onChange={(e) => dispatch(setSort(e.target.value))}>
                  {SORTS.map((s) => <option key={s} value={s === 'Select sort' ? '' : s}>{s}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* FILTERS SECTION */}
        <div className="data-panel__section">
          <div className="data-panel__section-header" onClick={() => toggleSection('filters')}>
            <div className="header-title">FILTERS</div>
            {sections.filters ? <FiChevronUp /> : <FiChevronDown />}
          </div>
        </div>

        {/* ADVANCED SETTINGS SECTION */}
        <div className="data-panel__section">
          <div className="data-panel__section-header" onClick={() => toggleSection('advanced')}>
            <div className="header-title">ADVANCED SETTINGS</div>
            {sections.advanced ? <FiChevronUp /> : <FiChevronDown />}
          </div>
        </div>
      </div>

      <div className="data-panel__footer" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button className="create-chart-btn" onClick={handleCreateChart}>
          <FiBarChart2 /> Create Chart
        </button>
        <button className="add-dashboard-btn" onClick={handleAddDashboard}>
          <FiPlus /> Add Dashboard
        </button>
      </div>
    </section>
  );
}
