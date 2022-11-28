import { useEffect, useState } from 'react';
import { BlueboardSocketManager } from 'blueboard-client';
import providerProps from '../models/ProviderProps';
import { globalState } from '../BlueboardClientInit';
import Echo from 'laravel-echo';
import React from 'react';

const BlueboardSocketProvider = ({ token, children }: providerProps) => {
    const BlueboardSocketContext = globalState.BlueboardSocketContext;

    const [socket, setSocket] = useState<Echo | undefined>(undefined);

    useEffect(() => {
        if (token == undefined) {
            console.warn(
                'No socket token set. Private channels may not be available.'
            );
        }

        console.log('DEBUG: Initializing WebSocket...');
        const sock: BlueboardSocketManager = new BlueboardSocketManager(
            globalState.props.blueboardUrl,
            globalState.props.blueboardWsUrl,
            globalState.props.blueboardSocketKey,
            token
        );

        sock.connect();
        setSocket(sock.getEcho());
        console.log('DEBUG: Echo is up!');

        return () => {
            console.log('DEBUG: Disconnecting from WebSocket server...');
            sock.disconnect();
            setSocket(undefined);
        };
    }, [token]);

    return (
        <BlueboardSocketContext.Provider value={socket}>
            {children}
        </BlueboardSocketContext.Provider>
    );
};

export default BlueboardSocketProvider;
