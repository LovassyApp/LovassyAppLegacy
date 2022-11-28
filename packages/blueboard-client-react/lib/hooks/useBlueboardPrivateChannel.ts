import { EchoChannel } from './../index';
import { useState, useEffect } from 'react';
import { useEvent, useSocket } from './helpers';

const useBlueboardPrivateChannel = (
    channelName: string,
    eventName: string,
    callback: CallableFunction
) => {
    const [wsChannel, setChannel] = useState<EchoChannel | undefined>(
        undefined
    );

    if (channelName == undefined) {
        throw new Error('No channel specified.');
    }
    if (eventName == undefined) {
        throw new Error('No event specified.');
    }
    if (callback == undefined) {
        throw new Error('No callback specified.');
    }
    const socket = useSocket();

    useEffect(() => {
        if (typeof socket?.private === 'function') {
            setChannel(socket.private(channelName) as EchoChannel);
        }
    }, [socket]);

    return useEvent(wsChannel, eventName, callback);
};

export default useBlueboardPrivateChannel;
