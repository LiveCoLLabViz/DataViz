import { io } from 'socket.io-client';
import { SOCKET_URL } from '@/utils/constants';

let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket'],
      //transports is an array of transport methods that the client can use to connect to the server. The default is ['polling', 'websocket'], but we are specifying only 'websocket' here to force the client to use WebSocket for communication.
      auth: () => ({ token: localStorage.getItem('token') }),
      //auth is a function that returns an object with the token property set to the value of the token item in localStorage. 
      // This is used to authenticate the socket connection.
      
    });
  }
  return socket;
}

export function connectSocket() {
  const s = getSocket();
  if (!s.connected) s.connect();
  return s;
}

export function disconnectSocket() {
  if (socket?.connected) socket.disconnect();
}

export default { getSocket, connectSocket, disconnectSocket };