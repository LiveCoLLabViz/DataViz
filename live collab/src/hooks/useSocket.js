import { useEffect, useRef } from 'react';
// Assumes socketService exposes: getSocket(), connectSocket(token), disconnectSocket()
// Adjust the import names below to match your existing src/services/socketService.js exports.
import { getSocket, connectSocket, disconnectSocket } from '../services/socketService';

/**
 * Subscribes to a socket event for the lifetime of the component.
 * Usage: useSocket('chat:message', (payload) => { ... });
 */
export default function useSocket(eventName, handler, deps = []) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const socket = getSocket ? getSocket() : null;
    if (!socket || !eventName) return undefined;

    const listener = (...args) => handlerRef.current?.(...args);
    socket.on(eventName, listener);

    return () => {
      socket.off(eventName, listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventName, ...deps]);
}

export { connectSocket, disconnectSocket };
