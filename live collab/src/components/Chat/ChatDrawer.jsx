import React, { useState, useRef, useEffect } from 'react';
import { FiMinus, FiExternalLink, FiSend } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import MessageBubble from './MessageBubble';
import { closeChatDrawer, addMessage } from '../../redux/slices/chatSlice';
import useAuth from '../../hooks/useAuth';
import { getSocket, connectSocket } from '../../services/socketService';
import './ChatDrawer.css';

export default function ChatDrawer({ inline = false }) {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { messages, typingUsers, isDrawerOpen } = useSelector((state) => state.chat);
  const activeWorkspaceId = useSelector((state) => state.workspace.activeWorkspaceId);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);
  const joinedRoomRef = useRef(null);

  // Connect socket & join workspace room, listen for incoming messages
  useEffect(() => {
    const socket = connectSocket();

    // Join the active workspace room
    if (activeWorkspaceId && joinedRoomRef.current !== activeWorkspaceId) {
      // Leave previous room if any
      if (joinedRoomRef.current) {
        socket.emit('leaveWorkspace', joinedRoomRef.current);
      }
      socket.emit('joinWorkspace', activeWorkspaceId);
      joinedRoomRef.current = activeWorkspaceId;
    }

    // Listen for incoming messages from other users
    const handleReceive = (data) => {
      // data = { name, message, createdAt }
      dispatch(addMessage({
        id: `remote-${Date.now()}-${Math.random()}`,
        senderName: data.name,
        text: data.message,
        timestamp: new Date(data.createdAt).getTime(),
      }));
    };

    socket.on('receiveMessage', handleReceive);

    return () => {
      socket.off('receiveMessage', handleReceive);
    };
  }, [activeWorkspaceId, dispatch]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isDrawerOpen]);

  if (!inline && !isDrawerOpen) return null;

  const handleSend = () => {
    if (!text.trim()) return;

    const socket = getSocket();
    const trimmed = text.trim();

    // Emit via socket to the backend
    socket.emit('sendMessage', {
      workspaceId: activeWorkspaceId,
      message: trimmed,
    });

    // Add to local state immediately for instant feedback
    dispatch(addMessage({
      id: `local-${Date.now()}`,
      senderName: user?.name || 'You',
      text: trimmed,
      timestamp: Date.now(),
    }));

    setText('');
  };

  const hasMessages = messages.length > 0;
  // Fallback placeholder messages when chat is empty
  const displayMessages = hasMessages ? messages : [
    { id: '1', senderName: 'Priya Sharma', text: 'Can we filter this data by date range?', timestamp: Date.now() - 3600000 },
    { id: '2', senderName: 'Rohit Verma', text: 'Yes, I will update the dashboard.', timestamp: Date.now() - 3500000 },
    { id: '3', senderName: user?.name || 'You', text: 'Great! Let me know if you need any help.', timestamp: Date.now() - 3400000 },
  ];

  return (
    <div className={`chat-drawer ${inline ? 'inline' : ''}`}>
      <div className="chat-drawer__header">
        <h3>Team Chat</h3>
        <div className="chat-drawer__actions">
          <button type="button" onClick={() => !inline && dispatch(closeChatDrawer())}>
            <FiMinus />
          </button>
          <button type="button">
            <FiExternalLink />
          </button>
        </div>
      </div>

      <div className="chat-drawer__messages">
        {displayMessages.map((m) => (
          <MessageBubble key={m.id} message={m} isOwn={m.senderName === (user?.name || 'You')} />
        ))}
        {typingUsers.length > 0 && (
          <div className="chat-drawer__typing">{typingUsers.join(', ')} typing...</div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-drawer__input-row">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
        />
        <button className="send-btn" type="button" onClick={handleSend}>
          <FiSend />
        </button>
      </div>
    </div>
  );
}
