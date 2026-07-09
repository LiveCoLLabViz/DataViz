import { useDrag, useDrop } from 'react-dnd';


export const FIELD_TYPE = 'DATA_FIELD';
/**
 * Makes a column/field element draggable from the WorkspaceSidebar tree.
 */
export function useDraggableField(field) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: FIELD_TYPE,
    item: field,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }), [field]);

  return { dragRef, isDragging };
}

/**
 * Makes a well (Rows / Columns / Filters) a drop target.
 */
export function useFieldDropWell(onDropField) {
  const [{ isOver, canDrop }, dropRef] = useDrop(() => ({
    accept: FIELD_TYPE,
    drop: (item) => onDropField(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [onDropField]);

  return { dropRef, isOver, canDrop };
}
