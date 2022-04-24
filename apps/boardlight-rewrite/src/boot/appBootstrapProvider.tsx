import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { FullScreenLoading } from "../components/content/fullScreenLoading";
import { RootState } from "../store/store";
import { eagerLoad } from "../utils/api/eagerLoad";
import { setControl } from "../store/slices/controlSlice";
import { setToken } from "../store/slices/tokenSlice";
import { useBlueboardClient } from "blueboard-client-react";
import { useLoading } from "../hooks/useLoading";
import { useNotifications } from "@mantine/notifications";
import { useRenew } from "../hooks/useRenew";

export const AppBootstrapProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
    const client = useBlueboardClient();
    const loading = useLoading();
    const renew = useRenew();

    const dispatch = useDispatch();

    const notifications = useNotifications();

    const reduxLoading = useSelector((state: RootState) => state.loading.value);
    const reduxToken = useSelector((state: RootState) => state.token.value);

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        (async () => {
            loading(true, "");

            let token: string;

            if (reduxToken) {
                token = reduxToken;
            } else {
                try {
                    token = await (await client.auth.loginWithCookie()).token;
                } catch (e) {
                    console.warn(e);
                }
            }

            if (token) {
                try {
                    loading(true, "Control lekérése...");
                    const control = await client.account.control(token);

                    dispatch(setControl(control));

                    try {
                        await eagerLoad(client, token);
                        dispatch(setToken(token));
                        renew();
                    } catch (err) {
                        notifications.showNotification({
                            title: "Hiba történt",
                            message: "A betöltés sikertelen",
                            color: "red",
                            autoClose: 5000,
                        });
                    }
                } catch (err) {
                    notifications.showNotification({
                        title: "Hiba történt",
                        message: "A control lekérése sikertelen",
                        color: "red",
                        autoClose: 5000,
                    });
                }
            }

            loading(false, "");
            setLoaded(true);
        })();
    }, []);

    if (!loaded) {
        return <FullScreenLoading />;
    }

    return (
        <>
            {reduxLoading && <FullScreenLoading />}
            {children}
        </>
    );
};
