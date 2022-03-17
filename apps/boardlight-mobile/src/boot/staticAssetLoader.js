import {
  Poppins_100Thin,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import React, { useEffect } from "react";
import { darkTheme, lightTheme } from "../utils/theme/themes";
import { setState, setTheme } from "../store/slices/settingsSlice";

import AppLoading from "expo-app-loading";
import { Appearance } from "react-native";
import { CourierPrime_400Regular } from "@expo-google-fonts/courier-prime";
import { FullScreenLoading } from "../components/fullScreenLoading";
import { loadData } from "../utils/misc/storageUtils";
import { useDispatch } from "react-redux";

export const StaticAssetLoader = ({ children }) => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_300Light,
    Poppins_100Thin,
    Poppins_400Regular_Italic,
    Poppins_700Bold,
    CourierPrime_400Regular,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const savedSettings = await loadData("settings");

      if (savedSettings !== null) {
        dispatch(setState(savedSettings));
      } else {
        dispatch(setTheme(Appearance.getColorScheme() === "dark" ? darkTheme : lightTheme));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!fontsLoaded) {
    return <FullScreenLoading />;
  }

  return children;
};
