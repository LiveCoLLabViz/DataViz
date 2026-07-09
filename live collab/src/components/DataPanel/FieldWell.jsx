import React from 'react';
import { FiX, FiPlus } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { addFieldToWell, removeFieldFromWell } from '../../redux/slices/chartSlice';
import { useFieldDropWell } from '../../hooks/useDragDropField';

export default function FieldWell({ label, wellKey, fields }) {
  const dispatch = useDispatch();

  const handleDrop = (field) => {
    dispatch(addFieldToWell({ well: wellKey, field }));
  };

  const { dropRef, isOver, canDrop } = useFieldDropWell(handleDrop);

  return (
    <div className="field-well">
      <div className="field-well__label">{label}</div>
      <div
        ref={dropRef}
        className={`field-well__dropzone ${isOver && canDrop ? 'is-over' : ''}`}
      >
        {fields.length === 0 && (
          <span className="field-well__placeholder">Drag fields here</span>
        )}
        {fields.map((field) => (
          <span key={field.id} className="field-chip">
            {field.name}
            <button
              type="button"
              onClick={() => dispatch(removeFieldFromWell({ well: wellKey, fieldId: field.id }))}
            >
              <FiX />
            </button>
          </span>
        ))}
        {fields.length === 0 && (
          <button className="field-well__add-btn">
            <FiPlus />
          </button>
        )}
      </div>
    </div>
  );
}
