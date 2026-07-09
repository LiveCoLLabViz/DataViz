import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import ShareModal from '../components/Common/ShareModal';
import UploadModal from '../components/Common/UploadModal';
import VersionHistoryPanel from '../components/VersionHistory';
import './MainLayout.css';

export default function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <Header />
      <div className="main-layout__body">
        {children || <Outlet />}
      </div>
      {/* Global overlays */}
      <ShareModal />
      <UploadModal />
      <VersionHistoryPanel />
    </div>
  );
}
