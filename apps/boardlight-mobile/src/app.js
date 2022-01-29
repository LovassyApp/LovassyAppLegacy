import { BLUEBOARD_SOKETI_HOST, BLUEBOARD_SOKETI_KEY, BLUEBOARD_URL } from "@env";
import { Provider, useSelector } from "react-redux";

import AppBootstrapProvider from "./bootstrap/AppBootstrapProvider";
import { BlueboardClientInit } from "blueboard-client-react";
import { NavigationDecider } from "./navigation/navigation";
import { Provider as PaperProvider } from "react-native-paper";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { lightTheme } from "./utils/theme/themes";
import { registerRootComponent } from "expo";
import store from "./store/store";

const [BlueboardProvider, BlueboardSocketProvider, BlueboardClientProvider] = BlueboardClientInit(
  BLUEBOARD_URL,
  BLUEBOARD_SOKETI_HOST,
  BLUEBOARD_SOKETI_KEY,
);

const ProviderStack = ({ children }) => {
  const token = useSelector((state) => state.token.value);
  const theme = useSelector((state) => state.theme.value);

  return (
    <>
      <StatusBar style={theme === lightTheme ? "dark" : "light"} />
      <BlueboardClientProvider token={token}>
        <AppBootstrapProvider>
          <BlueboardSocketProvider token={token}>
            <PaperProvider theme={theme}>{children}</PaperProvider>
          </BlueboardSocketProvider>
        </AppBootstrapProvider>
      </BlueboardClientProvider>
    </>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <ProviderStack>
        <NavigationDecider />
      </ProviderStack>
    </Provider>
  );
};

registerRootComponent(App);
