import BlueboardLoginResponse from "../../../../packages/blueboard-client/lib/models/BlueboardLoginResponse";
import { setControl } from "../store/slices/controlSlice";
import { setToken } from "../store/slices/tokenSlice";
import { useBlueboardClient } from "blueboard-client-react";
import { useDispatch } from "react-redux";
import { useLogout } from "./useLogout";

export const useRenew = (): (() => Promise<void>) => {
    const client = useBlueboardClient();
    const dispatch = useDispatch();

    const logout = useLogout();

    const renew = async (): Promise<void> => {
        return client.renew.start(refreshCallback, errorCallback);
    };

    const errorCallback = async (err: Error): Promise<void> => {
        console.error(err);
        await logout();
    };

    const refreshCallback = async (res: BlueboardLoginResponse): Promise<void> => {
        const { token } = res;
        client.account.control(token).then((control) => {
            dispatch(setToken(token));
            dispatch(setControl(control));
            renew();
        });
    };

    return renew;
};
