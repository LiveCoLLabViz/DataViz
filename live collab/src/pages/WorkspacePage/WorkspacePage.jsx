import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FiMessageCircle, FiUsers } from 'react-icons/fi';
import MainLayout from '../../layouts/MainLayout';
import WorkspaceSidebar from '../../components/WorkspaceSidebar';
import Toolbar from '../../components/Toolbar';
import DataPanel from '../../components/DataPanel';
import DashboardCanvas from '../../components/DashboardCanvas';
import ChatDrawer from '../../components/Chat/ChatDrawer';
import { fetchWorkspaces } from '../../redux/slices/workspaceSlice';
import { toggleChatDrawer } from '../../redux/slices/chatSlice';
import useAuth from '../../hooks/useAuth';
import './WorkspacePage.css';

export default function WorkspacePage() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const unreadCount = useSelector((state) => state.chat.unreadCount);
  const isChatOpen = useSelector((state) => state.chat.isDrawerOpen);
  const onlineCount = useSelector((state) => state.ui.onlineCount);

  useEffect(() => {
    const initData = async () => {
      // Use fallback ID if guest, otherwise user._id
      const userId = user?._id || user?.id || '507f1f77bcf86cd799439011';
      try {
        await dispatch(fetchWorkspaces(userId));
      } catch (err) {
        console.error('Failed to load initial data', err);
      }
    };
    initData();
  }, [dispatch, user]);

  return (
    <DndProvider backend={HTML5Backend}>
      <MainLayout>
        <div className="workspace-page">
          <WorkspaceSidebar />
          <div className="workspace-main">
            <Toolbar />
            <div className="workspace-content">
              <DataPanel />
              <DashboardCanvas />
            </div>
          </div>
        </div>

        {/* Floating bottom-right controls */}
        <div className={`floating-controls ${isChatOpen ? 'chat-open' : ''}`}>
          <div className="floating-controls__members" title="Active members">
            <FiUsers />
            <span>{onlineCount || 1}</span>
          </div>
          <button
            className="floating-controls__chat-btn"
            onClick={() => dispatch(toggleChatDrawer())}
            title={isChatOpen ? 'Close team chat' : 'Open team chat'}
          >
            <FiMessageCircle />
            {unreadCount > 0 && (
              <span className="floating-controls__badge">{unreadCount}</span>
            )}
          </button>
        </div>

        {/* Chat drawer overlay */}
        {isChatOpen && <ChatDrawer />}
      </MainLayout>
    </DndProvider>
  );
}
