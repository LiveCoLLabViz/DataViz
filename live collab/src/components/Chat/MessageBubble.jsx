import React from 'react';

export default function MessageBubble({ message, isOwn }) {
  return (
    <div className={`message-bubble ${isOwn ? 'is-own' : ''}`}>
      {!isOwn && <span className="message-bubble__sender">{message.senderName}</span>}
      <div className="message-bubble__content">{message.text}</div>
      <span className="message-bubble__time">
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
}
