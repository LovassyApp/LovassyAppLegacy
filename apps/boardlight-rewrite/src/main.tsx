import { ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { Provider, useDispatch, useSelector } from "react-redux";
import { RootState, store } from "./store/store";

import { AppBootstrapProvider } from "./boot/appBootstrapProvider";
import { BlueboardClientInit } from "blueboard-client-react";
import { BrowserRouter } from "react-router-dom";
import { FullScreenLoading } from "./components/fullScreenLoading";
import { LayoutDecider } from "./routes/layouts/layoutDecider";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { PersistGate } from "redux-persist/es/integration/react";
import React from "react";
import ReactDOM from "react-dom";
import { Router } from "./routes/router";
import { persistStore } from "redux-persist";
import { setColorScheme } from "./store/slices/settingsSlice";
import { useHotkeys } from "@mantine/hooks";

const persistor = persistStore(store);

// The ts plugin in vscode was being exceptionally stupid here
const [BlueboardProvider] = BlueboardClientInit(
    // @ts-ignore
    import.meta.env.VITE_BLUEBOARD_URL as string,
    // @ts-ignore
    import.meta.env.VITE_BLUEBOARD_SOKETI_HOST as string,
    // @ts-ignore
    import.meta.env.VITE_BLUEBOARD_SOKETI_KEY as string,
    true,
);

const ProviderStack = (): JSX.Element => {
    const colorScheme = useSelector((state: RootState) => state.settings.colorScheme);
    const dispatch = useDispatch();

    const toggleColorScheme = (value?: ColorScheme): void => {
        dispatch(setColorScheme(value || colorScheme === "dark" ? "light" : "dark"));
    };

    useHotkeys([["mod+J", () => toggleColorScheme()]]);

    const loading = useSelector((state: RootState) => state.loading.value);
    const token = useSelector((state: RootState) => state.token.value);

    return (
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <BlueboardProvider token={token}>
                <MantineProvider
                    theme={{ colorScheme }}
                    withNormalizeCSS={true}
                    withGlobalStyles={true}>
                    <ModalsProvider>
                        <NotificationsProvider>
                            <AppBootstrapProvider>
                                <Router />
                            </AppBootstrapProvider>
                        </NotificationsProvider>
                    </ModalsProvider>
                </MantineProvider>
            </BlueboardProvider>
        </ColorSchemeProvider>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <BrowserRouter>
                    <ProviderStack />
                </BrowserRouter>
            </PersistGate>
        </Provider>
    </React.StrictMode>,
    document.getElementById("root"),
);
