import { useContext, useEffect } from 'react';
import { globalState } from '../BlueboardClientInit';

const useSocket = () => {
    return useContext(globalState.BlueboardSocketContext);
};

const useEvent = (channel: any, eventName: any, callback: any) => {
    useEffect(() => {
        if (typeof channel.listen === 'function') {
            channel.listen(eventName, callback);
            console.log('DEBUG: Started listening for ' + eventName + '.');
        }
        return () => {
            if (typeof channel.stopListening === 'function') {
                channel.stopListening(eventName);
                console.log('DEBUG: Stopped listening for ' + eventName + '.');
            }
        };
    }, [channel]);
};

export { useSocket, useEvent };
