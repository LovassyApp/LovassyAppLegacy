import React, { useRef, useState } from "react";

import AppLoading from "expo-app-loading";
import { Five0Three } from "../screens/five0Three";
import { useBlueboardClient } from "blueboard-client-react";

export const CheckBlueboard = ({ children }) => {
  const client = useBlueboardClient();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const interval = useRef(null);

  const readyCallback = (res) => {
    if (res?.ready) {
      console.log("DEBUG: Blueboard ready!");
      clearInterval(interval.current);
      setError(false);
      setLoading(false);
    }
  };

  const intervalCallback = async () => {
    let res = null;

    try {
      res = await client.account.ping();
    } catch (err) {
      console.log("DEBUG: Blueboard check failed, retrying in 5 seconds");
      setError(true);
      setLoading(false);
    }

    readyCallback(res);
  };

  React.useEffect(() => {
    (async () => {
      console.log("DEBUG: Checking blueboard...");

      try {
        const res = await client.account.ping();
        if (!res.ready) {
          throw Error();
        }
        readyCallback(res);
      } catch (err) {
        setError(true);
        setLoading(false);
        interval.current = setInterval(intervalCallback, 5000);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <AppLoading />;
  }

  // TODO: Fix loading screen not showing for a while
  return <>{error ? <Five0Three /> : children}</>;
};
