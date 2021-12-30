import * as React from "react";

import { BlueboardClient } from "blueboard-client";

let BlueboardClientObj = new BlueboardClient(
  process.env.REACT_APP_BLUEBOARD_URL
);

export const BlueboardClientContext = React.createContext(BlueboardClientObj);

const BlueboardClientProvider = ({ token, children }) => {
  const [client, setClient] = React.useState(BlueboardClientObj);

  React.useEffect(() => {
    let newClient = new BlueboardClient(
      process.env.REACT_APP_BLUEBOARD_URL,
      token
    );
    BlueboardClientObj = newClient;
    setClient(newClient);
  }, [token]);

  return (
    <BlueboardClientContext.Provider value={client}>
      {children}
    </BlueboardClientContext.Provider>
  );
};

export default BlueboardClientProvider;

export { BlueboardClientObj };
