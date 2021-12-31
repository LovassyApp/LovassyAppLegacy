import * as React from 'react';
import { BlueboardSocketManager } from 'blueboard-client';
import env from '../.env.json';

export const SocketContext = React.createContext({});

const SocketProvider = ({ token, children }) => {
	const url = env.REACT_APP_BLUEBOARD_URL;
	const soketiHost = env.REACT_APP_BLUEBOARD_SOKETI_HOST;
	const soketiKey = env.REACT_APP_BLUEBOARD_SOKETI_KEY;

	const [socket, setSocket] = React.useState({});

	React.useEffect(() => {
		if (token == undefined) {
			console.warn('No socket token set. Private channels may not be available.');
		}
		console.log('DEBUG: Initializing WebSocket...');
		const sock = new BlueboardSocketManager(url, soketiHost, soketiKey, token);
		sock.connect();
		setSocket(sock.getEcho());
		console.log('DEBUG: Echo is up!');

		return () => {
			console.log('DEBUG: Disconnecting from WebSocket server...');
			sock.disconnect();
			setSocket({});
		};
	}, [token]);

	return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
