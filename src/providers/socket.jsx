import React, { useMemo, createContext, useContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socket = useMemo(() =>io("https://videobackend-n9ro.onrender.com", {
    transports: ["websocket"],
  })
  , []);
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
