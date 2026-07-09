import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import {
  setActiveDashboard, renameDashboard, closeDashboard,
} from '../../redux/slices/dashboardSlice';

export default function DashboardTabs() {
  const dispatch = useDispatch();
  const { dashboards, activeDashboardId } = useSelector((state) => state.dashboard);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const commitRename = (id) => {
    if (editValue.trim()) {
      dispatch(renameDashboard({ id, name: editValue.trim() }));
    }
    setEditingId(null);
  };

  return (
    <div className="dashboard-tabs">
      {dashboards.map((d) => (
        <div
          key={d.id}
          className={`dashboard-tab ${d.id === activeDashboardId ? 'is-active' : ''}`}
          onClick={() => dispatch(setActiveDashboard(d.id))}
          onDoubleClick={() => {
            setEditingId(d.id);
            setEditValue(d.name);
          }}
        >
          {editingId === d.id ? (
            <input
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => commitRename(d.id)}
              onKeyDown={(e) => e.key === 'Enter' && commitRename(d.id)}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span>{d.name}</span>
          )}
          {dashboards.length > 1 && (
            <button
              type="button"
              className="dashboard-tab__close"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(closeDashboard(d.id));
              }}
            >
              <FiX />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
