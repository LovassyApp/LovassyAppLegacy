import BlueboardProvider from './providers/BlueboardProvider';
import BlueboardSocketProvider from './providers/BlueboardSocketProvider';
import BlueboardClientProvider from './providers/BlueboardClientProvider';
import BlueboardClientProps from './models/BlueboardClientProps';
import { BlueboardClient } from 'blueboard-client';
import { createContext } from 'react';

let globalState: {
    props: BlueboardClientProps;
    BlueboardClientInstance: BlueboardClient;
    BlueboardClientContext: any;
    BlueboardSocketContext: any;
};

export { globalState };

const BlueboardClientInit = (
    blueboardUrl: string,
    blueboardWsUrl: string,
    blueboardSocketKey: string,
    cookies: boolean = false
) => {
    const props: BlueboardClientProps = new BlueboardClientProps(
        blueboardUrl,
        blueboardWsUrl,
        blueboardSocketKey,
        cookies
    );
    const client: BlueboardClient = new BlueboardClient(props.blueboardUrl, props.cookies);

    globalState = {
        props: props,
        BlueboardClientInstance: client,
        BlueboardClientContext: createContext(client),
        BlueboardSocketContext: createContext({}),
    };

    return [BlueboardProvider, BlueboardSocketProvider, BlueboardClientProvider];
};

export default BlueboardClientInit;
