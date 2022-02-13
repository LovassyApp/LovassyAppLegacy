import React, { useCallback } from 'react';

import Five0Three from '../Pages/503';
import Loading from '../Components/Loading';
import { useBlueboardClient } from 'blueboard-client-react';

let interval: any;

const CheckBlueboard = ({ children }: { children: React.ReactNode }): JSX.Element => {
    const client = useBlueboardClient();

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);

    const readyCallback = useCallback((res?) => {
        if (res?.ready) {
            clearInterval(interval);
            setError(false);
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const intervalCallback = useCallback(() => {
        (async () => {
            const res = await client.account.ping().catch(() => {
                setError(true);
                setLoading(false);
            });

            readyCallback(res);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        client.account
            .ping()
            .then((res) => {
                readyCallback(res);
            })
            .catch(() => {
                setError(true);
                setLoading(false);
                interval = setInterval(intervalCallback, 5000);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <>{loading ? <Loading /> : <>{error ? <Five0Three /> : children}</>}</>;
};

export default CheckBlueboard;
