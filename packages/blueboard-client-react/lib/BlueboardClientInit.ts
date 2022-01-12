import BlueboardProvider from './providers/BlueboardProvider';
import BlueboardSocketProvider from './providers/BlueboardSocketProvider';
import BlueboardClientProvider from './providers/BlueboardClientProvider';
import BlueboardClientProps from './models/BlueboardClientProps';
import { BlueboardClient } from 'blueboard-client';
import { createContext } from 'react';

let globalState: {
    env: BlueboardClientProps;
    BlueboardClientInstance: BlueboardClient;
    BlueboardClientContext: any;
    BlueboardSocketContext: any;
};

export { globalState };

const BlueboardClientInit = (blueboardUrl: string, blueboardWsUrl: string, blueboardSocketKey: string) => {
    const env: BlueboardClientProps = new BlueboardClientProps(blueboardUrl, blueboardWsUrl, blueboardSocketKey);
    const client: BlueboardClient = new BlueboardClient(env.blueboardUrl);

    globalState = {
        env: env,
        BlueboardClientInstance: client,
        BlueboardClientContext: createContext(client),
        BlueboardSocketContext: createContext({}),
    };

    return [BlueboardProvider, BlueboardSocketProvider, BlueboardClientProvider];
};

export default BlueboardClientInit;
