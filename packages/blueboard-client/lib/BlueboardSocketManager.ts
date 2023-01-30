import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import BlueboardEndpoints from './BlueboardEndpoints';
import BlueboardSocketException from './errors/BlueboardSocketException';

class BlueboardSocketManager {
    private echo: Echo | null = null;
    private pusher: Pusher | null = null;
    private pusherOptions: object;
    private key: string = '';
    private disconnectCallback: (event: any) => void;
    private connectCallback: (event: any) => void;
    private disconnectedPreviously: boolean = false;

    constructor(
        blueboardUrl: string,
        blueboardSoketiUrl: string,
        blueboardSoketiKey: string,
        token?: string,
        disconnectCallback?: (event: any) => void,
        connectCallback?: (event: any) => void
    ) {
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

        if (!connectCallback) {
            this.connectCallback = () => {};
        }
        if (!disconnectCallback) {
            this.disconnectCallback = () => {};
        }

        this.disconnectCallback = disconnectCallback as (event: any) => void;
        this.connectCallback = connectCallback as (event: any) => void;

        this.key = blueboardSoketiKey;
    }

    public connect = () => {
        try {
            this.pusher = new Pusher(this.key, this.pusherOptions);

            this.pusher.bind('pusher:error', (event: any) => {
                this.disconnectedPreviously = true;
                this.disconnectCallback(event);
            });
            this.pusher.connection.bind('connected', (event: any) => {
                if (this.disconnectedPreviously) {
                    this.disconnectedPreviously = false;
                    this.connectCallback(event);
                }
            });
            this.pusher.connection.bind('unavailable', (event: any) => {
                this.disconnectedPreviously = true;
                this.disconnectCallback(event);
            });

            this.echo = new Echo({
                broadcaster: 'pusher',
                client: this.pusher,
            });
        } catch (e) {
            const err = e as any;
            throw new BlueboardSocketException(
                err.message ?? 'WebSocket error.'
            );
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

    public getEcho = (): Echo => {
        if (this.echo instanceof Echo) {
            return this.echo;
        } else {
            throw new BlueboardSocketException("The socket isn't connected.");
        }
    };
}

export default BlueboardSocketManager;
