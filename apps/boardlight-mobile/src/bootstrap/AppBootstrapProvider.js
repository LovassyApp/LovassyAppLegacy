import {
  Poppins_100Thin,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import React, { useEffect, useState } from "react";
import { removeControl, setControl } from "../store/slices/controlSlice";
import { removeRefreshToken, setRefreshToken } from "../store/slices/refreshTokenSlice";
import { removeToken, setToken } from "../store/slices/tokenSlice";
import { useDispatch, useSelector } from "react-redux";

import AppLoading from "expo-app-loading";
import { CourierPrime_400Regular } from "@expo-google-fonts/courier-prime";
import { eagerLoad } from "../utils/api/eagerLoad";
import { secureLoadData } from "../utils/misc/storageUtils";
import { useBlueboardClient } from "blueboard-client-react";
import useRenew from "../hooks/useRenew";

const AppBootstrapProvider = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [canContinue, setContinue] = useState(false);

  const stateToken = useSelector((state) => state.token.value);
  const dispatch = useDispatch();

  const client = useBlueboardClient();
  const renew = useRenew();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_300Light,
    Poppins_100Thin,
    Poppins_400Regular_Italic,
    Poppins_700Bold,
    CourierPrime_400Regular,
  });

  const fetchControl = async (token, refreshToken) => {
    console.log("DEBUG: Control fetch...");
    return await client.account.control(token).then((res) => {
      renew(refreshToken);
      dispatch(setControl(res));
      dispatch(setToken(token));
      return res;
    });
  };

  const renewToken = async (refreshToken) => {
    console.log("DEBUG: Refreshing token...");

    return await client.auth.loginWithCookie(refreshToken).then((res) => {
      dispatch(setToken(res.token));
      dispatch(setRefreshToken(res.refreshToken));
      return res;
    });
  };

  const getNewToken = async (refreshToken, isExpired = false) => {
    await renewToken(refreshToken)
      .then((res) => {
        fetchControl(res.token, refreshToken).catch((err) => {
          dispatch(removeToken(isExpired));
          dispatch(removeRefreshToken());
          dispatch(removeControl());
        });
      })
      .catch((err) => {
        console.log("DEBUG: Couldn't get token! Cleaning up...");
        dispatch(removeToken(isExpired));
        dispatch(removeRefreshToken());
        dispatch(removeControl());
      });
  };

  useEffect(() => {
    console.log("DEBUG: Bootstrapping token...");
    (async () => {
      const storedToken = (await secureLoadData("token")) ?? { value: null, renewalError: false };
      const refreshToken = (await secureLoadData("refreshToken")) ?? { value: null };

      if (storedToken.value !== null) {
        try {
          await fetchControl(storedToken.value, refreshToken.value);
          dispatch(setRefreshToken(refreshToken.value));
        } catch (e) {
          console.log("DEBUG: Fetching control failed! Likely expired session");

          await getNewToken(refreshToken.value, true);
        } finally {
          setContinue(true);
        }
      } else {
        console.log("DEBUG: No token found! Trying to refresh...");
        await getNewToken(refreshToken.value, false);
        setContinue(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      if (canContinue) {
        try {
          if (stateToken !== null && !isReady) {
            await eagerLoad(client);
            setIsReady(true);
          } else {
            setIsReady(true);
          }
        } catch (err) {
          console.log(err);
          setIsReady(true);
        }
      }
    })();
  }, [stateToken, canContinue, client, isReady]);

  if (!(isReady && fontsLoaded)) {
    return <AppLoading />;
  }

  return children;
};

export default AppBootstrapProvider;
