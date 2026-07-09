import React, { useState } from 'react';
import { FiX, FiCopy, FiMail } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { closeShareModal } from '../../redux/slices/uiSlice';
import './ShareModal.css';
import './ShareModal.css';

const PERMISSIONS = ['Viewer', 'Editor', 'Owner'];

export default function ShareModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.isShareModalOpen);
  const activeWorkspaceId = useSelector((state) => state.workspace.activeWorkspaceId);
  const [permission, setPermission] = useState('Viewer');
  const [inviteEmail, setInviteEmail] = useState('');

  if (!isOpen) return null;

  const shareLink = `${window.location.origin}/workspace/${activeWorkspaceId || ''}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success('Link copied to clipboard');
  };

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    toast.success(`Invite sent to ${inviteEmail}`);
    setInviteEmail('');
  };

  return (
    <div className="modal-overlay" onClick={() => dispatch(closeShareModal())}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <span>Share Workspace</span>
          <button type="button" onClick={() => dispatch(closeShareModal())}><FiX /></button>
        </div>

        <div className="modal__body">
          <label className="modal__label">Workspace link</label>
          <div className="share-modal__link-row">
            <input readOnly value={shareLink} />
            <button type="button" onClick={handleCopy}><FiCopy /> Copy</button>
          </div>

          <label className="modal__label">Invite by email</label>
          <div className="share-modal__link-row">
            <input
              placeholder="name@company.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <button type="button" onClick={handleInvite}><FiMail /> Invite</button>
          </div>

          <label className="modal__label">Permission</label>
          <select value={permission} onChange={(e) => setPermission(e.target.value)}>
            {PERMISSIONS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
