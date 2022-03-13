import {
  Poppins_100Thin,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";

import AppLoading from "expo-app-loading";
import { CourierPrime_400Regular } from "@expo-google-fonts/courier-prime";
import React from "react";

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

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return children;
};
