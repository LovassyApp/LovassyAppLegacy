import {useDispatch} from "react-redux";
import {useBlueboardClient} from "blueboard-client-react";

const useLogout = (): (() => Promise<void>) => {
    const client = useBlueboardClient();
    const dispatch = useDispatch();

    return async () => {
        dispatch({type: "loader/forceLoader"});
        client.renew.stop();
        await client.auth.logout().then(() => {
            dispatch({type: "token/removeToken"});
            dispatch({type: "control/removeControl"});
            dispatch({type: "loader/removeLoader"});
        });
    };
};

export default useLogout;
