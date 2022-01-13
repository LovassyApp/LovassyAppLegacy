import { SocketContext } from '../Providers/SocketProvider';
import React, { useContext, useEffect, useState } from 'react';
import Echo from 'laravel-echo';

const useSocket = () => {
	return useContext(SocketContext);
};

const useEvent = (channel, eventName, callback) => {
	React.useEffect(() => {
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

const useChannel = (channelName, eventName, callback) => {
	const [wsChannel, setChannel] = useState({});

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
		if (socket instanceof Echo) {
			setChannel(socket.channel(channelName));
		}
	}, [socket]);

	return useEvent(wsChannel, eventName, callback);
};

const usePrivateChannel = (channelName, eventName, callback) => {
	const [wsChannel, setChannel] = useState({});

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
		if (socket instanceof Echo) {
			setChannel(socket.private(channelName));
		}
	}, [socket]);

	return useEvent(wsChannel, eventName, callback);
};

export { useChannel, usePrivateChannel };
