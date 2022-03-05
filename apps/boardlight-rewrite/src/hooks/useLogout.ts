import { removeControl } from "../store/slices/controlSlice";
import { removeToken } from "../store/slices/tokenSlice";
import { useBlueboardClient } from "blueboard-client-react";
import { useDispatch } from "react-redux";
import { useLoading } from "./useLoading";
import { useNotifications } from "@mantine/notifications";

export const useLogout = (): (() => Promise<void>) => {
    const client = useBlueboardClient();
    const dispatch = useDispatch();
    const loading = useLoading();
    const notifications = useNotifications();

    return async (): Promise<void> => {
        loading(true, "Kijelentkezés...");

        client.renew.stop();

        try {
            await client.auth.logout();

            dispatch(removeToken());
            dispatch(removeControl());
        } catch (err) {
            console.log(err);
            loading(false, "");

            notifications.showNotification({
                title: "Hiba történt",
                message: "Kijelentkezés sikertelen (probléma a szerverrel)",
                color: "red",
                autoClose: 5000,
            });
        }

        loading(false, "");
    };
};
