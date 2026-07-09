import React from 'react';
import { FiChevronRight, FiChevronDown, FiFolder, FiFile, FiDatabase, FiColumns } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { toggleNodeExpanded } from '../../redux/slices/workspaceSlice';
import { useDraggableField } from '../../hooks/useDragDropField';

// Recursive node renderer for: Workspace -> File -> Dataset -> Column
// node.type: 'workspace' | 'file' | 'dataset' | 'column'
export default function WorkspaceTreeNode({ node, depth = 0 }) {
  const dispatch = useDispatch();
  const expanded = useSelector((state) => !!state.workspace.expandedNodes[node.id]);
  const hasChildren = Array.isArray(node.children) && node.children.length > 0;
  const isColumn = node.type === 'column';

  const { dragRef, isDragging } = useDraggableField(isColumn ? node : null);

  const icon = {
    workspace: FiFolder,
    file: FiFile,
    dataset: FiDatabase,
    column: FiColumns,
  }[node.type] || FiFile;
  const Icon = icon;

  const handleToggle = () => {
    if (hasChildren) dispatch(toggleNodeExpanded(node.id));
  };

  return (
    <li className="tree-node">
      <div
        ref={isColumn ? dragRef : null}
        className={`tree-node__row ${isColumn ? 'is-draggable' : ''} ${isDragging ? 'is-dragging' : ''}`}
        style={{ paddingLeft: 10 + depth * 16 }}
        onClick={handleToggle}
      >
        {hasChildren ? (
          expanded ? <FiChevronDown className="tree-node__caret" /> : <FiChevronRight className="tree-node__caret" />
        ) : (
          <span className="tree-node__caret-spacer" />
        )}
        <Icon className={`tree-node__icon tree-node__icon--${node.type}`} />
        <span className="tree-node__label">{node.name}</span>
      </div>

      {hasChildren && expanded && (
        <ul className="tree-node__children">
          {node.children.map((child) => (
            <WorkspaceTreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}
