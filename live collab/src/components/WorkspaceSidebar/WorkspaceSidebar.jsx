import React, { useState } from 'react';
import { FiUploadCloud, FiChevronLeft, FiChevronsLeft, FiTrash2 } from 'react-icons/fi';
import { RiLayoutGridFill, RiFileTextLine, RiDatabase2Line, RiDashboardLine, RiShareLine, RiSettings4Line } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { openUploadModal } from '../../redux/slices/uploadSlice';
import { setActiveWorkspace, deleteWorkspace, fetchWorkspaceDatasets } from '../../redux/slices/workspaceSlice';
import { setDatasetColumns, addFieldToWell } from '../../redux/slices/chartSlice';
import { useDraggableField } from '../../hooks/useDragDropField';
import useAuth from '../../hooks/useAuth';
import './WorkspaceSidebar.css';

function DraggableColumn({ columnName, dataset }) {
  const dispatch = useDispatch();
  const columnsWell = useSelector((state) => state.chart.columns);
  
  const field = { 
    id: columnName, 
    name: columnName,
    datasetId: dataset?._id || dataset?.id,
    parsedData: dataset?.ParsedData
  };
  const { dragRef, isDragging } = useDraggableField(field);

  const handleClick = (e) => {
    e.stopPropagation();
    if (columnsWell.length === 0) {
      dispatch(addFieldToWell({ well: 'columns', field }));
    } else {
      dispatch(addFieldToWell({ well: 'rows', field }));
    }
    toast.success(`Added ${columnName} to fields`);
  };

  return (
    <li
      ref={dragRef}
      className={`workspace-column-item ${isDragging ? 'is-dragging' : ''}`}
      onClick={handleClick}
    >
      <span className="column-drag-handle">⋮⋮</span>
      <span className="column-name">{columnName}</span>
    </li>
  );
}

function DatasetItem({ file }) {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="workspace-dataset-wrapper">
      <div 
        className="workspace-dataset-item"
        onClick={(e) => {
          e.stopPropagation();
          setExpanded(!expanded);
          if (file?.columns) {
            dispatch(setDatasetColumns(file.columns));
          }
        }}
      >
        <RiDatabase2Line className="dataset-icon" />
        <span className="dataset-name">{file?.name || 'Unknown File'}</span>
      </div>
      {expanded && Array.isArray(file?.columns) && (
        <ul className="workspace-columns-list">
          {file.columns.map((col, idx) => (
            <DraggableColumn key={col || idx} columnName={col} dataset={file} />
          ))}
        </ul>
      )}
    </div>
  );
}



export default function WorkspaceSidebar() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const workspaces = useSelector((state) => state.workspace.workspaces);
  const activeWorkspaceId = useSelector((state) => state.workspace.activeWorkspaceId);
  const [collapsed, setCollapsed] = useState(false);

  React.useEffect(() => {
    if (activeWorkspaceId) {
      dispatch(fetchWorkspaceDatasets(activeWorkspaceId));
    }
  }, [dispatch, activeWorkspaceId]);

  const handleDelete = async (e, wsId, name) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete workspace "${name}"?`)) {
      const userId = user?._id || user?.id || '507f1f77bcf86cd799439011';
      try {
        await dispatch(deleteWorkspace({ workspaceId: wsId, userId })).unwrap();
        toast.success(`Workspace deleted`);
      } catch (err) {
        toast.error(`Failed to delete workspace: ${err}`);
      }
    }
  };

  return (
    <aside className={`workspace-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="workspace-sidebar__header">
        <button className="workspace-sidebar__collapse-btn top" onClick={() => setCollapsed(!collapsed)}>
          <FiChevronsLeft />
        </button>
      </div>



      {/* Dynamic Workspaces List */}
      <div className="workspace-sidebar__workspaces">
        {!collapsed && <h4 className="workspace-sidebar__title">YOUR WORKSPACES</h4>}
        <ul className="workspace-list">
          {workspaces.map((ws) => {
            const wsId = ws.id || ws._id;
            return (
              <li key={wsId} className="workspace-list__li">
                <button
                  className={`workspace-list__item ${wsId === activeWorkspaceId ? 'active' : ''}`}
                  onClick={() => dispatch(setActiveWorkspace(wsId))}
                  title={collapsed ? ws.name : undefined}
                >
                  <span className="ws-icon">{ws.name.charAt(0).toUpperCase()}</span>
                  {!collapsed && (
                    <>
                      <span className="ws-name">{ws.name}</span>
                      <div
                        className="ws-delete"
                        onClick={(e) => handleDelete(e, wsId, ws.name)}
                        title="Delete Workspace"
                      >
                        <FiTrash2 />
                      </div>
                    </>
                  )}
                </button>
                {/* Render datasets nested under the workspace if they exist */}
                {!collapsed && Array.isArray(ws.files) && ws.files.length > 0 && wsId === activeWorkspaceId && (
                  <ul className="workspace-datasets-list">
                    {ws.files.map((file, index) => (
                      <DatasetItem key={file?._id || index} file={file} />
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="workspace-sidebar__footer">
        <button
          className="workspace-sidebar__upload-btn"
          onClick={() => dispatch(openUploadModal())}
        >
          <FiUploadCloud />
          {!collapsed && <span>Upload File</span>}
        </button>
        
        <button className="workspace-sidebar__collapse-btn bottom" onClick={() => setCollapsed(!collapsed)}>
          <FiChevronLeft />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
