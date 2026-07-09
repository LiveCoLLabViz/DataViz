import React from 'react';
import { useSelector } from 'react-redux';
import { FiUserPlus } from 'react-icons/fi';
import Avatar from '../Common/Avatar';
import './ActiveMembers.css';

export default function ActiveMembers() {
  const { activeMembers, onlineCount } = useSelector((state) => state.ui);

  return (
    <div className="active-members">
      <div className="active-members__header">
        <h3>Active Members ({onlineCount || 4})</h3>
        <span className="live-badge"><span className="dot"></span> Live</span>
      </div>
      
      <div className="active-members__list">
        {activeMembers.length > 0 ? (
          activeMembers.slice(0, 4).map((member) => (
            <div key={member.id} className="member-row">
              <div className="member-avatar">
                <Avatar name={member.username} src={member.avatarUrl} size={32} />
                <span className={`status-dot ${member.online ? 'online' : ''}`}></span>
              </div>
              <div className="member-info">
                <div className="member-name">{member.username} {member.id === '1' ? '(You)' : ''}</div>
                <div className="member-status">{member.status || 'Viewing'}</div>
              </div>
            </div>
          ))
        ) : (
          // Mock data to match image since Redux might be empty
          <>
            <div className="member-row">
              <div className="member-avatar">
                <Avatar name="Ajay Kumar" size={32} />
                <span className="status-dot online"></span>
              </div>
              <div className="member-info">
                <div className="member-name">Ajay Kumar (You)</div>
                <div className="member-status editing">Editing</div>
              </div>
            </div>
            <div className="member-row">
              <div className="member-avatar">
                <Avatar name="Priya Sharma" size={32} bg="#10B981" />
              </div>
              <div className="member-info">
                <div className="member-name">Priya Sharma</div>
                <div className="member-status">Viewing</div>
              </div>
            </div>
            <div className="member-row">
              <div className="member-avatar">
                <Avatar name="Rohit Verma" size={32} bg="#F59E0B" />
              </div>
              <div className="member-info">
                <div className="member-name">Rohit Verma</div>
                <div className="member-status editing">Editing</div>
              </div>
            </div>
            <div className="member-row">
              <div className="member-avatar">
                <Avatar name="Sneha Patel" size={32} bg="#F97316" />
                <span className="status-dot online"></span>
              </div>
              <div className="member-info">
                <div className="member-name">Sneha Patel</div>
                <div className="member-status">Viewing</div>
              </div>
            </div>
          </>
        )}
      </div>

      <button className="invite-members-btn">
        <FiUserPlus /> Invite Members
      </button>
    </div>
  );
}
