import React from 'react';
import { FiX, FiRotateCcw } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { closeVersionPanel } from '../../redux/slices/versionSlice';
import './VersionHistoryPanel.css';

export default function VersionHistoryPanel() {
  const dispatch = useDispatch();
  const { versions, isPanelOpen, loading } = useSelector((state) => state.version);

  if (!isPanelOpen) return null;

  return (
    <div className="version-panel-overlay" onClick={() => dispatch(closeVersionPanel())}>
      <aside className="version-panel" onClick={(e) => e.stopPropagation()}>
        <div className="version-panel__header">
          <span>Version History</span>
          <button type="button" onClick={() => dispatch(closeVersionPanel())}>
            <FiX />
          </button>
        </div>

        <div className="version-panel__timeline">
          {loading && <p className="version-panel__empty">Loading versions...</p>}
          {!loading && versions.length === 0 && (
            <p className="version-panel__empty">No versions yet.</p>
          )}
          {versions.map((v) => (
            <div key={v.id} className="version-item">
              <div className="version-item__dot" />
              <div className="version-item__body">
                <div className="version-item__top">
                  <span className="version-item__number">v{v.versionNumber}</span>
                  <span className="version-item__time">{new Date(v.updatedAt).toLocaleString()}</span>
                </div>
                <div className="version-item__author">by {v.updatedBy}</div>
                <div className="version-item__actions">
                  <button type="button"><FiRotateCcw /> Restore</button>
                  <button type="button">Compare</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
