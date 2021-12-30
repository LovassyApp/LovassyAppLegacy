import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useUser } from '../Hooks/ControlHooks';
import { useChannel, usePrivateChannel } from '../Hooks/SocketManager';

const GlobalListeners = () => {
	const user = useUser();
	useEffect(() => {
		if (user !== undefined && Object.keys(user).length !== 0) {
			//console.log(user);
		}
	}, [user]);

	useChannel('global', 'GlobalEvent', (data) => {
		toast(data.message);
	});

	return '';
};

export default GlobalListeners;
