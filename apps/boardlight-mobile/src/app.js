import { BLUEBOARD_SOKETI_HOST, BLUEBOARD_SOKETI_KEY, BLUEBOARD_URL } from "@env";
import { BlueboardClientInit, useBlueboardPrivateChannel } from "blueboard-client-react";
import { Provider, useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { darkTheme, lightTheme } from "./utils/theme/themes";
import { setState, setTheme } from "./store/slices/settingsSlice";

import AppBootstrapProvider from "./bootstrap/appBootstrapProvider";
import { Appearance } from "react-native";
import { BlueboardLoloResponseFactory } from "blueboard-client";
import { FullScreenLoading } from "./components/fullScreenLoading";
import { Ionicons } from "@expo/vector-icons";
import { NavigationDecider } from "./navigation/navigation";
import { Provider as PaperProvider } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { loadData } from "./utils/misc/storageUtils";
import { registerRootComponent } from "expo";
import { setCoins } from "./store/slices/coinsSlice";
import { setStore } from "./store/slices/storeSlice";
import { setUser } from "./store/slices/controlSlice";
import store from "./store/store";
import { useUser } from "./hooks/controlHooks";

const [BlueboardProvider, BlueboardSocketProvider, BlueboardClientProvider] = BlueboardClientInit(
  BLUEBOARD_URL,
  BLUEBOARD_SOKETI_HOST,
  BLUEBOARD_SOKETI_KEY,
);

const ProviderStack = ({ children }) => {
  const token = useSelector((state) => state.token.value);
  const theme = useSelector((state) => state.settings.theme);
  const loading = useSelector((state) => state.loading.value);
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
  }, []);

  return (
    <>
      <StatusBar style={theme.dark ? "light" : "dark"} />
      <BlueboardClientProvider token={token}>
        <AppBootstrapProvider>
          <BlueboardSocketProvider token={token}>
            <ListenerStack>
              <PaperProvider
                settings={{
                  icon: (props) => <Ionicons {...props} />,
                }}
                theme={theme}>
                {/* This is here because it needs the theme and I didn't want to make a new provider for it */}
                {loading && <FullScreenLoading />}
                {children}
              </PaperProvider>
            </ListenerStack>
          </BlueboardSocketProvider>
        </AppBootstrapProvider>
      </BlueboardClientProvider>
    </>
  );
};

const ListenerStack = ({ children }) => {
  const dispatch = useDispatch();
  const user = useUser();

  useBlueboardPrivateChannel("Store", "ProductUpdated", (data) => {
    const { products } = data;

    dispatch(setStore(products));
  });

  useBlueboardPrivateChannel(`Users.${user.id}`, "LoloAmountUpdated", (data) => {
    const newUser = { ...user, balance: data.balance };
    dispatch(setCoins(BlueboardLoloResponseFactory.getCoins(data.coins)));
    dispatch(setUser(newUser));
  });

  return children;
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
