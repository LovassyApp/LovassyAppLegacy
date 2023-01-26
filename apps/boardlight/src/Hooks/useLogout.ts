import { useDispatch } from 'react-redux';
import { useBlueboardClient } from 'blueboard-client-react';

const useLogout = (): (() => Promise<void>) => {
    const client = useBlueboardClient();
    const dispatch = useDispatch();

    return async () => {
        dispatch({ type: 'loader/forceLoader' });
        client.renew.stop();
        try {
            await client.auth.logout();
        } catch (err) {
            console.log('hello');
            console.log(err);
        } finally {
            dispatch({ type: 'token/removeToken' });
            dispatch({ type: 'control/removeControl' });
            dispatch({ type: 'loader/removeLoader' });
        }
    };
};

export default useLogout;
