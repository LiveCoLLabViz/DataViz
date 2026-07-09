import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isShareModalOpen: false,
  activeMembers: [],
  onlineCount: 0,
  theme: 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openShareModal(state) {
      state.isShareModalOpen = true;
    },
    closeShareModal(state) {
      state.isShareModalOpen = false;
    },
    setActiveMembers(state, action) {
      state.activeMembers = action.payload;
      state.onlineCount = action.payload.length;
    },
  },
});

export const { openShareModal, closeShareModal, setActiveMembers } = uiSlice.actions;
export default uiSlice.reducer;
