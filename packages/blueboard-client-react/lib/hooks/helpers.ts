import { EchoChannel } from './../index';
import { useContext, useEffect } from 'react';
import { globalState } from '../BlueboardClientInit';

const useSocket = () => {
    return useContext(globalState.BlueboardSocketContext);
};

const useEvent = (
    channel: EchoChannel | undefined,
    eventName: string,
    callback: CallableFunction
) => {
    useEffect(() => {
        if (typeof channel?.listen === 'function') {
            channel.listen(eventName, callback);
            console.log(
                'DEBUG: Started listening for ' +
                    eventName +
                    ' on ' +
                    channel.name +
                    '.'
            );
        }
        return () => {
            if (typeof channel?.stopListening === 'function') {
                channel.stopListening(eventName);
                console.log(
                    'DEBUG: Stopped listening for ' +
                        eventName +
                        ' on ' +
                        channel.name +
                        '.'
                );
            }
        };
    }, [channel]);
};

export { useSocket, useEvent };
