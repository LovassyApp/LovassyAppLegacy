import { eagerLoad } from "../utils/api/eagerLoad";
import { setControl } from "../store/slices/controlSlice";
import { setToken } from "../store/slices/tokenSlice";
import { useBlueboardClient } from "blueboard-client-react";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useLoading } from "../hooks/useLoading";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@mantine/notifications";
import { useRenew } from "../hooks/useRenew";

export const AppBootstrapProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
    const client = useBlueboardClient();
    const loading = useLoading();
    const renew = useRenew();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const notifications = useNotifications();

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
                        navigate("/home");
                    } catch (err) {
                        notifications.showNotification({
                            title: "Hiba történt",
                            message: "A betöltés sikertelen",
                            color: "red",
                            autoClose: 5000,
                        });
                    } finally {
                        loading(false, "");
                    }
                } catch (err) {
                    loading(false, "");
                    notifications.showNotification({
                        title: "Hiba történt",
                        message: "A control lekérése sikertelen",
                        color: "red",
                        autoClose: 5000,
                    });
                }
            } catch (err) {
                loading(false, "");
                console.log(err);
            }
        })();
    }, []);

    return <>{children}</>;
};
