import { Provider, useSelector } from "react-redux";
import React from "react";
import { lightTheme } from "./utils/theme/themes";
import { NavigationDecider } from "./navigation/navigation";
import { Provider as PaperProvider } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { registerRootComponent } from "expo";
import store from "./store/store";
import { BlueboardClientInit } from "blueboard-client-react";
import { BLUEBOARD_URL, BLUEBOARD_SOKETI_HOST, BLUEBOARD_SOKETI_KEY } from "@env";
import AppBootstrapProvider from "./bootstrap/AppBootstrapProvider";

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
