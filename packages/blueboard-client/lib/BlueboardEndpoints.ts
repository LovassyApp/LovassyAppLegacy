class BlueboardEndpoints {
    public readonly base: string | null = null;
    public readonly apiBase: string = '/api';
    public readonly about: string = '';
    public readonly auth: {
        register: string;
        login: string;
        logout: string;
        socket: string;
    };
    public readonly admin: {
        qrcodes: string;
        products: string;
        permissions: { scopes: string; groups: string };
        users: string;
    };

    public readonly control: string = '';
    public readonly kreta: { base: string; grades: string };
    public readonly lolo: string = '';
    public readonly store: string = '';
    public readonly ping: string = '';
    public readonly inventory: string = '';
    public readonly boot: string = '';
    public readonly requests: {
        base: string;
        all: string;
    };

    constructor(baseUrl: string) {
        this.base = baseUrl + this.apiBase;

        this.about = this.base + '/version';

        this.auth = {
            register: this.base + '/register',
            login: this.base + '/login',
            logout: this.base + '/logout',
            socket: this.base + '/broadcasting/auth',
        };

        this.admin = {
            qrcodes: this.base + '/qrcodes',
            products: this.base + '/products',
            permissions: {
                groups: this.base + '/permissions/groups',
                scopes: this.base + '/permissions/list',
            },
            users: this.base + '/users',
        };

        this.control = this.base + '/control';

        this.kreta = {
            base: this.base + '/kreta',
            grades: this.base + '/kreta/grades',
        };

        this.lolo = this.base + '/lolo';
        this.store = this.base + '/store';
        this.inventory = this.base + '/inventory';
        this.requests = {
            base: this.base + '/lolo/requests',
            all: this.base + '/lolo/requests/all',
        };

        this.ping = this.base + '/status';
        this.boot = this.base + '/boot';
    }
}

export default BlueboardEndpoints;
