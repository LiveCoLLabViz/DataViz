import React, { useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 're-resizable';
import { FiCopy, FiTrash2, FiMaximize2, FiDownload } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { toPng } from 'html-to-image';
import ChartRenderer from '../Charts';
import { updateChart, removeChart, duplicateChart } from '../../redux/slices/dashboardSlice';
import './ChartCard.css';

// NOTE: uses `react-draggable` and `re-resizable` for drag/resize/grid-snap behavior.
// Add them to package.json if not already present:
//   npm install react-draggable re-resizable
export default function ChartCard({ dashboardId, chart }) {
  const dispatch = useDispatch();
  const alignment = useSelector((state) => state.dashboard.alignment);
  const nodeRef = useRef(null);
  const chartBodyRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragStop = (_e, data) => {
    setIsDragging(false);
    dispatch(updateChart({
      dashboardId,
      chartId: chart.id,
      changes: { position: { x: data.x, y: data.y } },
    }));
  };

  const handleResizeStop = (_e, _dir, ref) => {
    dispatch(updateChart({
      dashboardId,
      chartId: chart.id,
      changes: { size: { width: ref.offsetWidth, height: ref.offsetHeight } },
    }));
  };

  const handleExport = async () => {
    if (!chartBodyRef.current) return;
    try {
      const dataUrl = await toPng(chartBodyRef.current, { backgroundColor: '#ffffff' });
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute('href', dataUrl);
      downloadAnchorNode.setAttribute('download', (chart.title || 'chart') + '.png');
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (err) {
      console.error('Failed to export image', err);
    }
  };

  return (
    <Draggable
      key={chart.position ? `${chart.position.x}-${chart.position.y}` : 'default'}
      nodeRef={nodeRef}
      grid={[20, 20]}
      handle=".chart-card__header"
      defaultPosition={chart.position}
      onStart={handleDragStart}
      onStop={handleDragStop}
      disabled={isFullscreen}
    >
      <div 
        ref={nodeRef} 
        className={`chart-card ${isFullscreen ? 'chart-card--fullscreen' : ''} ${isDragging ? 'chart-card--dragging' : ''}`} 
        style={!isFullscreen ? { position: 'absolute', left: 0, top: 0 } : {}}
      >
        <Resizable
          className="chart-card__resizable"
          size={chart.size}
          grid={[20, 20]}
          minWidth={240}
          minHeight={180}
          onResizeStop={handleResizeStop}
        >
          <div className="chart-card__header">
            <span className="chart-card__title" style={{ textAlign: alignment }}>{chart.title || 'Untitled Chart'}</span>
            <div className="chart-card__actions">
              <button type="button" title="Duplicate" onClick={() => dispatch(duplicateChart({ dashboardId, chartId: chart.id }))}>
                <FiCopy />
              </button>
              <button type="button" title="Export as PNG" onClick={handleExport}>
                <FiDownload />
              </button>
              <button type="button" title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"} onClick={() => setIsFullscreen(!isFullscreen)}>
                <FiMaximize2 />
              </button>
              <button type="button" title="Delete" onClick={() => dispatch(removeChart({ dashboardId, chartId: chart.id }))}>
                <FiTrash2 />
              </button>
            </div>
          </div>
          <div className="chart-card__body" ref={chartBodyRef}>
            <ChartRenderer
              type={chart.chartType}
              data={chart.data}
              color={chart.color}
              showLegend={chart.showLegend}
              showTooltip={chart.showTooltip}
            />
          </div>
        </Resizable>
      </div>
    </Draggable>
  );
}
