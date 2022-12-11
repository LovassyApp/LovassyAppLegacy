import { BLUEBOARD_SOKETI_HOST, BLUEBOARD_SOKETI_KEY, BLUEBOARD_URL } from "@env";
import { BlueboardClientInit, useBlueboardPrivateChannel } from "blueboard-client-react";
import {
  BlueboardInventoryFactory,
  BlueboardLoloRequestFactory,
  BlueboardLoloResponseFactory,
} from "blueboard-client";
import { Provider, useDispatch, useSelector } from "react-redux";
import React from "react";
import { addItem, updateItem } from "./store/slices/inventorySlice";

import { AppBootstrapProvider } from "./boot/appBootstrapProvider";
import { CheckBlueboard } from "./boot/checkBlueboard";
import { FullScreenLoading } from "./components/fullScreenLoading";
import { Ionicons } from "@expo/vector-icons";
import { NavigationDecider } from "./navigation/navigation";
import { Provider as PaperProvider } from "react-native-paper";
import { StaticAssetLoader } from "./boot/staticAssetLoader";
import { StatusBar } from "expo-status-bar";
import { setCoins } from "./store/slices/coinsSlice";
import { setRequests } from "./store/slices/requestsSlice";
import { setStore } from "./store/slices/storeSlice";
import { setUserBalance } from "./store/slices/controlSlice";
import store from "./store/store";
import { useUser } from "./hooks/controlHooks";

const [BlueboardProvider] = BlueboardClientInit(
  BLUEBOARD_URL,
  BLUEBOARD_SOKETI_HOST,
  BLUEBOARD_SOKETI_KEY,
);

const ProviderStack = ({ children }) => {
  // console.log(BLUEBOARD_URL);

  const token = useSelector((state) => state.token.value);
  const theme = useSelector((state) => state.settings.theme);
  const loading = useSelector((state) => state.loading.value);

  return (
    <>
      <StatusBar style={theme.dark ? "light" : "dark"} />
      <BlueboardProvider token={token}>
        <StaticAssetLoader>
          <PaperProvider
            settings={{
              icon: (props) => <Ionicons {...props} />,
            }}
            theme={theme}>
            <CheckBlueboard>
              <AppBootstrapProvider>
                <ListenerStack>
                  {/* This is here because it needs the theme and I didn't want to make a new provider for it */}
                  {loading && <FullScreenLoading />}
                  {children}
                </ListenerStack>
              </AppBootstrapProvider>
            </CheckBlueboard>
          </PaperProvider>
        </StaticAssetLoader>
      </BlueboardProvider>
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
    dispatch(setCoins(BlueboardLoloResponseFactory.getCoins(data.coins)));
    dispatch(setUserBalance(data.balance));
  });

  useBlueboardPrivateChannel(`Users.${user.id}`, "InventoryItemCreated", (data) => {
    dispatch(addItem(BlueboardInventoryFactory.getItem(data.item)));
  });

  useBlueboardPrivateChannel(`Users.${user.id}`, "RequestUpdated", (data) => {
    dispatch(setRequests(BlueboardLoloRequestFactory.getResponse(data.requests)));
  });

  useBlueboardPrivateChannel(`Users.${user.id}`, "InventoryItemUsed", (data) => {
    dispatch(updateItem(BlueboardInventoryFactory.getItem(data.item)));
  });

  return children;
};

export const App = () => {
  return (
    <Provider store={store}>
      <ProviderStack>
        <NavigationDecider />
      </ProviderStack>
    </Provider>
  );
};

// registerRootComponent(App);
