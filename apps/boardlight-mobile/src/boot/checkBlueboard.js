import React, { useState } from "react";

import AppLoading from "expo-app-loading";
import { Five0Three } from "../screens/five0Three";
import { useBlueboardClient } from "blueboard-client-react";

// TODO: Fix memory leak and unneccessary calls
let interval;

export const CheckBlueboard = ({ children }) => {
  const client = useBlueboardClient();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const readyCallback = (res) => {
    if (res?.ready) {
      clearInterval(interval);
      setError(false);
      setLoading(false);
    }
  };

  const intervalCallback = async () => {
    let res = null;

    try {
      res = await client.account.ping();
    } catch (err) {
      setError(true);
      setLoading(false);
    }

    readyCallback(res);
  };

  React.useEffect(() => {
    (async () => {
      try {
        const res = await client.account.ping();
        readyCallback(res);
      } catch (err) {
        setError(true);
        setLoading(false);
        interval = setInterval(intervalCallback, 5000);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TODO: Fix loading screen not showing for a while
  return <>{loading ? <AppLoading /> : <>{error ? <Five0Three /> : children}</>}</>;
};
