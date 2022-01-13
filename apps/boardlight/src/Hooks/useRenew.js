import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { useBlueboardClient } from 'blueboard-client-react';
import useLogout from './useLogout';

const useRenew = () => {
    const client = useBlueboardClient();
    const logout = useLogout();
    const dispatch = useDispatch();

    const renew = async () => {
        return client.renew.start(callback, (err) => {
            logout().then(() => {
                Swal.fire({
                    title: 'Probléma!',
                    text: 'Hú csávókám hát, ez nagyon lent van, hogy kilettél rakva innen.',
                    icon: 'error',
                    confirmButtonText: 'többet nem fordul elő...',
                });
            });
        });
    };

    const callback = async (res) => {
        const token = res.token;
        client.account.control(token).then((res) => {
            dispatch({ type: 'token/setToken', payload: token });
            dispatch({ type: 'control/setControl', payload: res });
            renew();
        });
    };

    return renew;
};

export default useRenew;
