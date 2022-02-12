import { DarkTheme, DefaultTheme, configureFonts } from "react-native-paper";

const fontConfig = {
  web: {
    regular: {
      fontFamily: "Poppins_400Regular",
      fontWeight: "normal",
    },
    medium: {
      fontFamily: "Poppins_500Medium",
      fontWeight: "normal",
    },
    light: {
      fontFamily: "Poppins_300Light",
      fontWeight: "normal",
    },
    thin: {
      fontFamily: "Poppins_100Thin",
      fontWeight: "normal",
    },
  },
  ios: {
    regular: {
      fontFamily: "Poppins_400Regular",
      fontWeight: "normal",
    },
    medium: {
      fontFamily: "Poppins_500Medium",
      fontWeight: "normal",
    },
    light: {
      fontFamily: "Poppins_300Light",
      fontWeight: "normal",
    },
    thin: {
      fontFamily: "Poppins_100Thin",
      fontWeight: "normal",
    },
  },
  android: {
    regular: {
      fontFamily: "Poppins_400Regular",
      fontWeight: "normal",
    },
    medium: {
      fontFamily: "Poppins_500Medium",
      fontWeight: "normal",
    },
    light: {
      fontFamily: "Poppins_300Light",
      fontWeight: "normal",
    },
    thin: {
      fontFamily: "Poppins_100Thin",
      fontWeight: "normal",
    },
  },
};

export const lightTheme = {
  ...DefaultTheme,
  roundness: 15,
  fonts: configureFonts(fontConfig),
  colors: {
    ...DefaultTheme.colors,
    primary: "#1976d2",
    accent: "#0d47a1",
  },
};

export const darkTheme = {
  ...DarkTheme,
  roundness: 15,
  fonts: configureFonts(fontConfig),
  colors: {
    ...DarkTheme.colors,
    primary: "#1976d2",
    accent: "#0d47a1",
    onSurface: "#121212",
  },
};
