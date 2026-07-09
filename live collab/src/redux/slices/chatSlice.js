import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  typingUsers: [],
  unreadCount: 0,
  isDrawerOpen: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage(state, action) {
      state.messages.push(action.payload);
      if (!state.isDrawerOpen) state.unreadCount += 1;
    },
    setMessages(state, action) {
      state.messages = action.payload;
    },
    setTypingUsers(state, action) {
      state.typingUsers = action.payload;
    },
    openChatDrawer(state) {
      state.isDrawerOpen = true;
      state.unreadCount = 0;
    },
    closeChatDrawer(state) {
      state.isDrawerOpen = false;
    },
    toggleChatDrawer(state) {
      state.isDrawerOpen = !state.isDrawerOpen;
      if (state.isDrawerOpen) state.unreadCount = 0;
    },
  },
});

export const {
  addMessage,
  setMessages,
  setTypingUsers,
  openChatDrawer,
  closeChatDrawer,
  toggleChatDrawer,
} = chatSlice.actions;
export default chatSlice.reducer;
