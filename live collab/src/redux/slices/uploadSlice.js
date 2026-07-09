import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isModalOpen: false,
  progress: 0,
  status: 'idle',
  error: null,
  previewData: null,
};

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    openUploadModal(state) {
      state.isModalOpen = true;
      state.status = 'idle';
      state.progress = 0;
      state.error = null;
      state.previewData = null;
    },
    closeUploadModal(state) {
      state.isModalOpen = false;
    },
    setUploadProgress(state, action) {
      state.progress = action.payload;
      state.status = 'uploading';
    },
    setUploadSuccess(state, action) {
      state.status = 'success';
      state.previewData = action.payload;
    },
    setUploadError(state, action) {
      state.status = 'error';
      state.error = action.payload;
    },
  },
});

export const {
  openUploadModal,
  closeUploadModal,
  setUploadProgress,
  setUploadSuccess,
  setUploadError,
} = uploadSlice.actions;
export default uploadSlice.reducer;
