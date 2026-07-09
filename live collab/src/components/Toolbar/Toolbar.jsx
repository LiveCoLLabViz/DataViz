import React from 'react';
import {
  FiCornerUpLeft, FiCornerUpRight, FiSave, FiZoomIn, FiZoomOut,
  FiAlignLeft, FiAlignCenter, FiAlignRight, FiPlus, FiShare2, FiClock, FiChevronDown
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  setZoom,
  setAlignment,
  addDashboard,
  undoHistory,
  redoHistory,
} from '../../redux/slices/dashboardSlice';
import { openShareModal } from '../../redux/slices/uiSlice';
import { openVersionPanel } from '../../redux/slices/versionSlice';
import { createNewWorkspace } from '../../redux/slices/workspaceSlice';
import useAuth from '../../hooks/useAuth';
import './Toolbar.css';

const ALIGN_OPTIONS = [
  { key: 'left', label: 'Left', icon: FiAlignLeft },
  { key: 'center', label: 'Center', icon: FiAlignCenter },
  { key: 'right', label: 'Right', icon: FiAlignRight },
];

export default function Toolbar() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const zoom = useSelector((state) => state.dashboard.zoom);
  const alignment = useSelector((state) => state.dashboard.alignment);

  const canUndo = useSelector((state) => state.dashboard.past.length > 0);
  const canRedo = useSelector((state) => state.dashboard.future.length > 0);
  const dashboardState = useSelector((state) => ({
    dashboards: state.dashboard.dashboards,
    activeDashboardId: state.dashboard.activeDashboardId,
    zoom: state.dashboard.zoom,
    alignment: state.dashboard.alignment,
  }));

  const handleUndo = () => {
    if (!canUndo) {
      toast('Nothing to undo');
      return;
    }
    dispatch(undoHistory());
    toast.success('Undid last dashboard change');
  };

  const handleRedo = () => {
    if (!canRedo) {
      toast('Nothing to redo');
      return;
    }
    dispatch(redoHistory());
    toast.success('Redid dashboard change');
  };

  const handleSave = () => {
    localStorage.setItem('live-collab-dashboard', JSON.stringify(dashboardState));
    toast.success('Dashboard saved locally');
  };

  const handleZoomIn = () => dispatch(setZoom(Math.min(200, zoom + 10)));
  const handleZoomOut = () => dispatch(setZoom(Math.max(25, zoom - 10)));

  const handleCreateWorkspace = async () => {
    const name = window.prompt('Workspace name');
    if (name) {
      // Use a valid 24-character hex string as fallback for MongoDB ObjectId
      const userId = user?._id || user?.id || '507f1f77bcf86cd799439011';
      try {
        await dispatch(createNewWorkspace({ userId, data: { name } })).unwrap();
        toast.success(`Workspace "${name}" created`);
      } catch (err) {
        toast.error(`Failed to create workspace: ${err}`);
      }
    }
  };

  return (
    <div className="toolbar">
      <div className="toolbar__group">
        <button type="button" className="toolbar__icon-btn" onClick={handleUndo} title="Undo">
          <FiCornerUpLeft />
          <span>Undo</span>
        </button>
        <button type="button" className="toolbar__icon-btn" onClick={handleRedo} title="Redo">
          <FiCornerUpRight />
          <span>Redo</span>
        </button>
      </div>

      <button type="button" className="toolbar__btn" onClick={handleSave}>
        <FiSave /> Save
      </button>

      <div className="toolbar__zoom">
        <button type="button" className="toolbar__zoom-btn" onClick={handleZoomOut}>
          <FiZoomOut />
        </button>
        <span className="toolbar__zoom-value">{zoom}% <FiChevronDown style={{ fontSize: '14px', color: '#6B7280' }}/></span>
        <button type="button" className="toolbar__zoom-btn" onClick={handleZoomIn}>
          <FiZoomIn />
        </button>
      </div>

      <div className="toolbar__align">
        {ALIGN_OPTIONS.map(({ key, label, icon: Icon }) => (
          <button
            type="button"
            key={key}
            className={`toolbar__align-btn ${alignment === key ? 'is-active' : ''}`}
            onClick={() => dispatch(setAlignment(key))}
          >
            <Icon /> {label}
          </button>
        ))}
      </div>

      <button type="button" className="toolbar__btn toolbar__btn--primary" onClick={handleCreateWorkspace}>
        <FiPlus /> Create New Workspace
      </button>

      <button type="button" className="toolbar__btn" onClick={() => dispatch(openShareModal())}>
        <FiShare2 /> Share
      </button>

      <button
        type="button"
        className="toolbar__btn toolbar__btn--outline toolbar__version-btn"
        onClick={() => dispatch(openVersionPanel())}
      >
        <FiClock /> Version History
      </button>
    </div>
  );
}
