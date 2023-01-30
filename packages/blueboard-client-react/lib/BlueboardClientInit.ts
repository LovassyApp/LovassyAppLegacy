import BlueboardProvider from './providers/BlueboardProvider';
import BlueboardSocketProvider from './providers/BlueboardSocketProvider';
import BlueboardClientProvider from './providers/BlueboardClientProvider';
import BlueboardClientProps from './models/BlueboardClientProps';
import { BlueboardClient } from 'blueboard-client';
import { Context, createContext } from 'react';
import Echo from 'laravel-echo';

let globalState: {
    props: BlueboardClientProps;
    BlueboardClientInstance: BlueboardClient;
    BlueboardClientContext: Context<BlueboardClient>;
    BlueboardSocketContext: Context<Echo | undefined>;
};

export { globalState };

const BlueboardClientInit = (
    blueboardUrl: string,
    blueboardWsUrl: string,
    blueboardSocketKey: string,
    cookies: boolean = false,
    wsDisconnectCallback: (event: any) => void = (event: any) => {},
    wsConnectCallback: (event: any) => void = (event: any) => {}
): [
    typeof BlueboardProvider,
    typeof BlueboardSocketProvider,
    typeof BlueboardClientProvider
] => {
    const props: BlueboardClientProps = new BlueboardClientProps(
        blueboardUrl,
        blueboardWsUrl,
        blueboardSocketKey,
        cookies,
        wsDisconnectCallback,
        wsConnectCallback
    );

    const client: BlueboardClient = new BlueboardClient(
        props.blueboardUrl,
        props.cookies
    );

    globalState = {
        props: props,
        BlueboardClientInstance: client,
        BlueboardClientContext: createContext(client),
        BlueboardSocketContext: createContext<Echo | undefined>(undefined),
    };

    return [
        BlueboardProvider,
        BlueboardSocketProvider,
        BlueboardClientProvider,
    ];
};

export default BlueboardClientInit;
