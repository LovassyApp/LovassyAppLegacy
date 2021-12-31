import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import BlueboardEndpoints from './BlueboardEndpoints';
import BlueboardSocketException from './errors/BlueboardSocketException';

class BlueboardSocketManager {
	private echo: Echo | null = null;
	private pusher: Pusher | null = null;
	private pusherOptions: object;
	private key: string = '';

	constructor(blueboardUrl: string, blueboardSoketiUrl: string, blueboardSoketiKey: string, token?: string) {
		const endpoints = new BlueboardEndpoints(blueboardUrl);

		this.pusherOptions = {
			wsHost: blueboardSoketiUrl,
			wsPort: 6001,
			forceTLS: false,
			encrypted: true,
			disableStats: true,
			enabledTransports: ['ws', 'wss'],
			authEndpoint: endpoints.auth.socket,
			auth: {
				headers: {
					Authorization: `Bearer ${token ?? ''}`,
					Accept: 'application/json',
				},
			},
		};

		this.key = blueboardSoketiKey;
	}

	public connect = () => {
		try {
			this.pusher = new Pusher(this.key, this.pusherOptions);
			this.echo = new Echo({
				broadcaster: 'pusher',
				client: this.pusher,
			});
		} catch (e) {
			const err = e as any;
			throw new BlueboardSocketException(err.message ?? 'WebSocket error.');
		}

		return true;
	};

	public disconnect = () => {
		if (this.echo instanceof Echo) {
			this.echo?.disconnect();
			this.pusher?.disconnect();
			this.echo = null;
			this.pusher = null;
		} else {
			throw new BlueboardSocketException("The socket isn't connected.");
		}
	};

	public getEcho = () => {
		if (this.echo instanceof Echo) {
			return this.echo;
		} else {
			throw new BlueboardSocketException("The socket isn't connected.");
		}
	};
}

export default BlueboardSocketManager;
