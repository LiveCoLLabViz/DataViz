import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getSocket, connectSocket, disconnectSocket } from '../services/socketService';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      connectSocket(token);
    }
    return () => {
      disconnectSocket();
    };
  }, [token]);

  const value = useMemo(() => ({ getSocket }), []);


  //what is it doing? useMemo is a React hook that memoizes the value of getSocket so that it doesn't get recreated on every render. 
  // This is important because we want to ensure that the socket instance remains consistent across renders and doesn't cause unnecessary re-renders of components that consume this context.
  //but we want socket instance to be recreated when the token changes, so we don't include token in the dependency array of useMemo. Instead, we handle the socket connection and disconnection in the useEffect hook above, which does depend on the token.


  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export const useSocketContext = () => useContext(SocketContext);
//the above line is a custom hook that allows components to easily access the socket context. 
// It uses the useContext hook to retrieve the current value of the SocketContext, which is provided by the SocketProvider component
// . This makes it convenient for any component within the provider's tree to access the socket instance and related functionality without having to pass props down manually through multiple levels of the component hierarchy.
export default SocketContext;
