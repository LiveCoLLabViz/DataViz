import React from 'react';
import { FiPlus, FiMessageCircle } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import DashboardTabs from './DashboardTabs';
import { addDashboard } from '../../redux/slices/dashboardSlice';
import { toggleChatDrawer } from '../../redux/slices/chatSlice';
import ActiveMembers from '../Members';
import './Footer.css';

export default function Footer() {
  const dispatch = useDispatch();
  const unreadCount = useSelector((state) => state.chat.unreadCount);

  return (
    <footer className="app-footer">
      <button
        type="button"
        className="app-footer__add-btn"
        onClick={() => dispatch(addDashboard())}
      >
        <FiPlus /> Add Dashboard
      </button>

      <div className="app-footer__tabs">
        <DashboardTabs />
      </div>

      <div className="app-footer__right">
        <ActiveMembers />
        <button
          type="button"
          className="app-footer__chat-btn"
          onClick={() => dispatch(toggleChatDrawer())}
        >
          <FiMessageCircle />
          Open Chat
          {unreadCount > 0 && <span className="app-footer__badge">{unreadCount}</span>}
        </button>
      </div>
    </footer>
  );
}
