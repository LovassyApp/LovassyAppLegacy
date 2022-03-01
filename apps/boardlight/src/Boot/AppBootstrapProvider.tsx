import { createContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useBlueboardClient } from 'blueboard-client-react';
import useLoaderState from '../Hooks/useLoaderState';
import useLogout from '../Hooks/useLogout';
import useRenew from '../Hooks/useRenew';
import Loading from '../Components/Loading';
import useToken from '../Hooks/useToken';
import Swal from 'sweetalert2';
import { BlueboardControlException } from 'blueboard-client';
import useSystemTheme from '../Hooks/useSystemTheme';

export const AppBootstrapContext = createContext(false);

const AppBootstrapProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
    useSystemTheme();

    const [loading, setLoading] = useState(true);
    const [canShow, setShow] = useState(false);
    const [bootstrapInProgress, setBootstrapInProgress] = useState(true);

    const dispatch = useDispatch();
    const token = useToken();
    const loader = useLoaderState();
    const client = useBlueboardClient();
    const logout = useLogout();
    const startRenew = useRenew();

    const fcontrol = async (token: string): Promise<void> => {
        console.log('DEBUG: Control fetch...');

        await client.account.control(token).then((res) => {
            dispatch({ type: 'control/setControl', payload: res });

            setTimeout(() => setShow(true), 0);
            setTimeout(() => setLoading(false), 300);
        });
    };

    useEffect(() => {
        setTimeout(() => setShow(false), 0);
        setTimeout(() => setLoading(true), 0);

        if (token !== null) {
            fcontrol(token)
                .then(() => {
                    startRenew();
                    dispatch({ type: 'loader/removeLoader' });
                    setBootstrapInProgress(false);
                })
                .catch((err) => {
                    if (err instanceof BlueboardControlException) {
                        logout().then(() => {
                            Swal.fire({
                                title: 'A Manóba',
                                text: 'Szóval ömm igen... Úgy tűnik valami elszállt, kérlek jelentkezz be újra.',
                                icon: 'error',
                                confirmButtonText: 'Igenis!',
                            });
                        });
                    } else {
                        throw err;
                    }
                });
        } else {
            client.auth
                .loginWithCookie()
                .then((res) => {
                    fcontrol(res.token).then(() => {
                        startRenew();
                        dispatch({ type: 'token/setToken', payload: res.token });
                        dispatch({ type: 'loader/removeLoader' });
                        setBootstrapInProgress(false);
                    });
                })
                .catch((err) => {
                    console.log(err);
                    setTimeout(() => setShow(true), 0);
                    setTimeout(() => setLoading(false), 300);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!bootstrapInProgress) {
            if (loader) {
                setTimeout(() => setShow(false), 0);
                setTimeout(() => setLoading(true), 0);
            } else {
                setTimeout(() => setShow(true), 0);
                setTimeout(() => setLoading(false), 300);
            }
        }
    }, [loader, bootstrapInProgress]);

    return (
        <AppBootstrapContext.Provider value={canShow}>
            <>
                {loading ? <Loading /> : null}
                {children}
            </>
        </AppBootstrapContext.Provider>
    );
};

export default AppBootstrapProvider;
