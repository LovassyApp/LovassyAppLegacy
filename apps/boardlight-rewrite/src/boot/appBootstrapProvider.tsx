import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { FullScreenLoading } from "../components/fullScreenLoading";
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

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        (async () => {
            loading(true, "");

            try {
                const res = await client.auth.loginWithCookie();
                try {
                    loading(true, "Control lekérése...");
                    const control = await client.account.control(res.token);

                    dispatch(setControl(control));

                    try {
                        await eagerLoad(client, res.token);
                        dispatch(setToken(res.token));
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
            } catch (err) {
                console.log(err);
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
