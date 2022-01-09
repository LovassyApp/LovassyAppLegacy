import React from "react";
import { BlueboardSocketManager } from "blueboard-client";
import { BLUEBOARD_URL, BLUEBOARD_SOKETI_HOST, BLUEBOARD_SOKETI_KEY } from "@env";

export const SocketContext = React.createContext({});

export const SocketProvider = ({ token, children }) => {
  const [socket, setSocket] = React.useState({});

  React.useEffect(() => {
    const url = BLUEBOARD_URL;
    const soketiHost = BLUEBOARD_SOKETI_HOST;
    const soketiKey = BLUEBOARD_SOKETI_KEY;
    if (token === null) {
      console.warn("No socket token set. Private channels may not be available.");
    }

    console.log("DEBUG: Initializing WebSocket...");

    const sock = new BlueboardSocketManager(url, soketiHost, soketiKey, token);
    sock.connect();
    setSocket(sock.getEcho());

    console.log("DEBUG: Echo is up!");

    return () => {
      console.log("DEBUG: Disconnecting from WebSocket server...");

      sock.disconnect();
      setSocket({});
    };
  }, [token]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
