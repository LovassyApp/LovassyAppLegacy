import React from "react";
import ReactDOM from "react-dom";
import { Router } from "./routes/router";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import { RootState, store } from "./store/store";
import { persistStore } from "redux-persist";
import { ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { setColorScheme } from "./store/slices/settingsSlice";
import { useHotkeys } from "@mantine/hooks";
import { BrowserRouter } from "react-router-dom";
import { LayoutDecider } from "./pages/layouts/layoutDecider";
import { FullScreenLoading } from "./components/fullScreenLoading";

const persistor = persistStore(store);

const ProviderStack = (): JSX.Element => {
    const colorScheme = useSelector((state: RootState) => state.settings.colorScheme);
    const dispatch = useDispatch();

    const toggleColorScheme = (value?: ColorScheme): void => {
        dispatch(setColorScheme(value || colorScheme === "dark" ? "light" : "dark"));
    };

    useHotkeys([["mod+J", () => toggleColorScheme()]]);

    const loading = useSelector((state: RootState) => state.loading.value);

    return (
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider
                theme={{ colorScheme }}
                withNormalizeCSS={true}
                withGlobalStyles={true}>
                <ModalsProvider>
                    <NotificationsProvider>
                        <LayoutDecider>
                            {loading && <FullScreenLoading />}
                            <Router />
                        </LayoutDecider>
                    </NotificationsProvider>
                </ModalsProvider>
            </MantineProvider>
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
