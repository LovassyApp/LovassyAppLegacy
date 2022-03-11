import AppLoading from "expo-app-loading";
import { Five0Three } from "../screens/five0Three";
import React from "react";
import { useBlueboardClient } from "blueboard-client-react";

let interval;

export const CheckBlueboard = ({ children }) => {
  const client = useBlueboardClient();

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

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

  return <>{loading ? <AppLoading /> : <>{error ? <Five0Three /> : children}</>}</>;
};
