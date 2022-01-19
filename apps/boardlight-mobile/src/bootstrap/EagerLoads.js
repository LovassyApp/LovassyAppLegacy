import { useBlueboardClient } from "blueboard-client-react";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const EagerLoads = () => {
  const token = useSelector((state) => state.token.value);

  useEffect(() => {
    if (token !== null) {
      // Eager loaded stuff goes here
      // ie. stuff that we want to cache when the user starts the app
    }
  }, []);

  return <></>;
};

export default EagerLoads;
