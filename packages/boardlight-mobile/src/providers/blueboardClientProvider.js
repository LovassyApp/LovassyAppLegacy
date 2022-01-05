import React from "react";
import { BlueboardClient } from "blueboard-client";
import { BLUEBOARD_URL } from "@env";

export let BlueboardClientInstance = new BlueboardClient(BLUEBOARD_URL);

export const BlueboardClientContext = React.createContext(BlueboardClientInstance);

export const BlueboardClientProvider = ({ token, children }) => {
  const [client, setClient] = React.useState(BlueboardClientInstance);

  React.useEffect(() => {
    const newClient = new BlueboardClient(BLUEBOARD_URL, token);

    BlueboardClientInstance = newClient;
    setClient(newClient);
  }, [token]);

  return (
    <BlueboardClientContext.Provider value={client}>{children}</BlueboardClientContext.Provider>
  );
};
