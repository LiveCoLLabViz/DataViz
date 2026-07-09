import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDrop } from 'react-dnd';
import { FiPlus, FiX, FiBarChart2 } from 'react-icons/fi';
import ChartCard from './ChartCard';
import { addChartToActiveDashboard, setActiveDashboard, closeDashboard } from '../../redux/slices/dashboardSlice';
import { FIELD_TYPE } from '../../hooks/useDragDropField';
import './DashboardCanvas.css';

export function buildChartData({ rows, columns, filters, aggregation, sort }) {
  const xAxisField = columns[0];
  const yAxisField = rows[0];

  if (xAxisField && yAxisField && xAxisField.parsedData) {
    const rawData = xAxisField.parsedData;
    const xKey = xAxisField.name;
    const yKey = yAxisField.name;

    const grouped = {};
    rawData.forEach(row => {
      let xVal = row[xKey];
      if (xVal === null || xVal === undefined) xVal = 'Unknown';
      const yVal = parseFloat(row[yKey]) || 0;
      if (!grouped[xVal]) grouped[xVal] = [];
      grouped[xVal].push(yVal);
    });

    const result = Object.keys(grouped).map(xVal => {
      const values = grouped[xVal];
      let aggValue = 0;
      switch (aggregation) {
        case 'count': aggValue = values.length; break;
        case 'min': aggValue = Math.min(...values); break;
        case 'max': aggValue = Math.max(...values); break;
        case 'average': aggValue = values.reduce((a,b)=>a+b,0) / values.length; break;
        case 'sum': 
        default:
          aggValue = values.reduce((a,b)=>a+b,0);
          break;
      }
      return { name: String(xVal), value: aggValue };
    });

    if (sort === 'ascending') result.sort((a,b) => a.value - b.value);
    if (sort === 'descending') result.sort((a,b) => b.value - a.value);

    return result.slice(0, 100);
  }

  // Fallback to mock data if fields are missing parsedData
  const source = rows.length ? rows : columns.length ? columns : filters.length ? filters : [{ id: 'sample', name: 'Sample' }];
  const normalized = source.map((field, index) => {
    let value = field.name.length * 12 + index * 8 + 20;
    switch (aggregation) {
      case 'count':
        value = 1 + index;
        break;
      case 'min':
        value = 5 + index * 2;
        break;
      case 'max':
        value = 35 + index * 12;
        break;
      case 'average':
        value = Math.round((value + 10) / 2);
        break;
      default:
        break;
    }
    return { name: field.name, value };
  });

  if (sort === 'ascending') {
    normalized.sort((a, b) => a.value - b.value);
  }
  if (sort === 'descending') {
    normalized.sort((a, b) => b.value - a.value);
  }

  return normalized;
}

export default function DashboardCanvas() {
  const dispatch = useDispatch();
  const zoom = useSelector((state) => state.dashboard.zoom);
  const activeDashboardId = useSelector((state) => state.dashboard.activeDashboardId);
  const allDashboards = useSelector((state) => state.dashboard.dashboards);
  const activeWorkspaceId = useSelector((state) => state.workspace.activeWorkspaceId);
  const {
    rows, columns, filters, colorScheme, showLegend, showTooltip, chartType, aggregation, sort,
  } = useSelector((state) => state.chart);

  // Filter dashboards to only show ones belonging to the currently active workspace
  const dashboards = allDashboards.filter(d => 
    d.workspaceId === activeWorkspaceId || (d.workspace && (d.workspace === activeWorkspaceId || d.workspace._id === activeWorkspaceId))
  );
  
  const activeDashboard = dashboards.find((d) => d.id === activeDashboardId || d._id === activeDashboardId);

  const [, dropRef] = useDrop(() => ({
    accept: FIELD_TYPE,
    drop: (field, monitor) => {
      const offset = monitor.getClientOffset();
      dispatch(addChartToActiveDashboard({
        id: `chart-${Date.now()}`,
        title: field.name,
        chartType,
        color: colorScheme,
        showLegend,
        showTooltip,
        data: buildChartData({ rows, columns, filters, aggregation, sort }),
        position: { x: offset?.x || 40, y: offset?.y || 40 },
        size: { width: 320, height: 240 },
      }));
    },
  }), [addChartToActiveDashboard, chartType, colorScheme, showLegend, showTooltip, rows, columns, filters, aggregation, sort, activeDashboardId]);

  return (
    <div className="dashboard-area">
      {/* Dashboard tab bar */}
      {dashboards.length > 0 && (
        <div className="dashboard-tabs">
          {dashboards.map((d) => {
            const dId = d.id || d._id;
            const isActive = dId === activeDashboardId;
            return (
              <div
                key={dId}
                className={`dashboard-tab ${isActive ? 'active' : ''}`}
                onClick={() => dispatch(setActiveDashboard(dId))}
              >
                <FiBarChart2 className="dashboard-tab__icon" />
                <span>{d.name || 'Untitled'}</span>
                <button
                  className="dashboard-tab__close"
                  onClick={(e) => { e.stopPropagation(); dispatch(closeDashboard(dId)); }}
                  title="Close dashboard"
                >
                  <FiX />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <section className="dashboard-canvas" ref={dropRef}>
        <div
          className="dashboard-canvas__surface"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
        >
          {(!activeDashboard || activeDashboard.charts.length === 0) && (
            <div className="dashboard-canvas__empty">
              <div className="empty-state-graphic">
                <div className="graphic-box">
                  <div className="bar bar-1"></div>
                  <div className="bar bar-2"></div>
                  <div className="bar bar-3"></div>
                  <div className="bar bar-4"></div>
                  <div className="bar bar-5"></div>
                </div>
                <div className="graphic-plus">
                  <FiPlus />
                </div>
              </div>
              <h2>Build Your Visualization</h2>
              <p>Drag and drop fields from the left panel to start creating your chart</p>
              
              <svg className="arrow-graphic" width="45" height="35" viewBox="0 0 45 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M43.5 1.5C39.5 9.5 28.5 24 10 30" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 22L10 30L17 33.5" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
          {activeDashboard?.charts.map((chart) => (
            <ChartCard key={chart.id} dashboardId={activeDashboard.id || activeDashboard._id} chart={chart} />
          ))}
        </div>
      </section>
    </div>
  );
}
