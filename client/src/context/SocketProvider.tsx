import { createContext, useEffect, useState } from "react"
import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:8080';

const socket = URL ? io(URL) : io();

interface SocketContextProps {
  connected: boolean,
  on?: (event: string, callback: (...args: any[]) => void) => void,
  off?: (event: string, callback?: (...args: any[]) => void) => void,
  emit?: (ev: string, ...args: any[]) => void,
};
export const SocketContext = createContext<SocketContextProps>({connected: false});

interface Props {
  children: React.ReactNode,
};
const SocketProvider: React.FC<Props> = ({children}) => {
  const [connected, setConnected] = useState(socket.connected);

  const on = (event: string, callback: (...args: any[]) => void) => {
    if(socket.connected) {
      console.log(`[Socket.io] Registered Event: ${event}`)
      socket.on(event, callback);
    }
  }
  const off = (event: string, callback?: (...args: any[]) => void) => {
    if(socket.connected) {
      console.log(`[Socket.io] Unregister Event: ${event}`);
      socket.off(event, callback);
    }
  }
  const emit = (ev: string, ...args: any[]) => {
    if(socket.connected) {
      console.log(`[Socket.io] Emitting event: ${ev}`);
      socket.emit(ev, ...args);
    }
  }

  useEffect(() => {
    socket.on('connect', () => {
      setConnected(true);
      console.log('Connected');
    });
    socket.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected');
    });


    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{connected, on, off, emit}}>
      {children}
    </SocketContext.Provider>
  )
}
export default SocketProvider;
