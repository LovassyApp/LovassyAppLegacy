import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { useBlueboardClient } from 'blueboard-client-react';
import useLogout from './useLogout';
import { BlueboardLoginResponse } from 'blueboard-client';

const useRenew = (): (() => Promise<void>) => {
    const client = useBlueboardClient();
    const logout = useLogout();
    const dispatch = useDispatch();

    const renew = async (): Promise<void> => {
        return client.renew.start(callback, () => {
            logout().then(() => {
                Swal.fire({
                    title: 'Probléma!',
                    text: 'Hú csávókám, ez nagyon lent van, hogy ki lettél rakva innen. (Lejárt a session, kérlek jelentkezz be újra)',
                    icon: 'error',
                    confirmButtonText: 'Többet nem fordul elő...',
                });
            });
        });
    };

    const callback = async (res: BlueboardLoginResponse): Promise<void> => {
        const { token } = res;
        client.account.control(token).then((res) => {
            dispatch({ type: 'token/setToken', payload: token });
            dispatch({ type: 'control/setControl', payload: res });
            renew();
        });
    };

    return renew;
};

export default useRenew;
