import { removeControl } from "../store/slices/controlSlice";
import { removeToken } from "../store/slices/tokenSlice";
import { useBlueboardClient } from "blueboard-client-react";
import { useDispatch } from "react-redux";
import { useLoading } from "./useLoading";

export const useLogout = (): (() => Promise<void>) => {
    const client = useBlueboardClient();
    const dispatch = useDispatch();
    const loading = useLoading();

    return async (): Promise<void> => {
        loading(true, "Kijelentkezés...");

        client.renew.stop();

        await client.auth.logout().then(() => {
            dispatch(removeToken());
            dispatch(removeControl());
        });

        loading(false, "");
    };
};
