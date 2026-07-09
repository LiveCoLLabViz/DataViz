import React, { useRef } from 'react';
import { FiX, FiUploadCloud } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  closeUploadModal, setUploadProgress, setUploadSuccess, setUploadError,
} from '../../redux/slices/uploadSlice';
import { setDatasetColumns } from '../../redux/slices/chartSlice';
import { addFileToWorkspace } from '../../redux/slices/workspaceSlice';
import ProgressBar from './postgressbar';
import './UploadModal.css';
import { uploadFile } from '../../services/uploadservice';

const ACCEPTED = '.csv,.xlsx,.xls,.json';

export default function UploadModal() {
  const dispatch = useDispatch();
  const { isModalOpen, progress, status, error, previewData } = useSelector((state) => state.upload);
  const activeWorkspaceId = useSelector((state) => state.workspace.activeWorkspaceId);
  const inputRef = useRef(null);

  if (!isModalOpen) return null;

  const handleFile = async (file) => {
    if (!file) return;

    if (!activeWorkspaceId) {
      toast.error('Please select or create a workspace first');
      return;
    }

    try {
      const result = await uploadFile(activeWorkspaceId, file, (pct) => dispatch(setUploadProgress(pct)));
      dispatch(setUploadSuccess(result));

      // Populate the FIELDS panel with the uploaded dataset's columns
      const dataset = result.dataset;
      if (dataset) {
        dispatch(addFileToWorkspace({ workspaceId: activeWorkspaceId, file: dataset }));
        if (dataset.columns) {
          dispatch(setDatasetColumns(dataset.columns));
        }
      }

      toast.success(`File "${file.name}" uploaded successfully!`);
    } catch (err) {
      console.error("[UploadModal] Caught error:", err);
      const errMsg = err?.message || 'Upload failed';
      dispatch(setUploadError(errMsg));
      toast.error(errMsg);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="modal-overlay" onClick={() => dispatch(closeUploadModal())}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <span>Upload Dataset</span>
          <button type="button" onClick={() => dispatch(closeUploadModal())}><FiX /></button>
        </div>

        <div className="modal__body">
          <div
            className="upload-modal__dropzone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <FiUploadCloud size={28} />
            <p>Drag & drop a CSV, Excel, or JSON file, or click to browse</p>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED}
              hidden
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>

          {status === 'uploading' && <ProgressBar value={progress} />}
          {status === 'error' && <p className="upload-modal__error">{error}</p>}
          {status === 'success' && previewData && (
            <div className="upload-modal__preview">
              <p className="upload-modal__preview-title">
                ✅ {previewData.dataset?.name || 'File'} uploaded
              </p>
              <p className="upload-modal__preview-detail">
                {previewData.dataset?.columns?.length || 0} columns · {previewData.dataset?.rowCount || 0} rows
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
