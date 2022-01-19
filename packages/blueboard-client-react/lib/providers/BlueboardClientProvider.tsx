import { useEffect, useState, createContext } from 'react';
import { BlueboardClient } from 'blueboard-client';
import providerProps from '../models/ProviderProps';
import { globalState } from '../BlueboardClientInit';

const BlueboardClientProvider = ({ token, children }: providerProps) => {
    const BlueboardClientContext = globalState.BlueboardClientContext;

    const [client, setClient] = useState<BlueboardClient>(globalState.BlueboardClientInstance);

    useEffect(() => {
        let newClient: BlueboardClient = new BlueboardClient(
            globalState.props.blueboardUrl,
            globalState.props.cookies,
            token
        );
        globalState.BlueboardClientInstance = newClient;
        setClient(newClient);
    }, [token]);

    return <BlueboardClientContext.Provider value={client}>{children}</BlueboardClientContext.Provider>;
};

export default BlueboardClientProvider;
