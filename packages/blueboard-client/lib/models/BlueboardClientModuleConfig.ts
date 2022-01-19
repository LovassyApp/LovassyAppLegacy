import BlueboardState from './BlueboardState';

class BlueboardClientModuleConfig {
    constructor(
        public readonly blueboardUrl: string,
        public readonly state: BlueboardState,
        public readonly cookies: boolean,
        public readonly apiToken?: string,
        public readonly defaultErrorHandler?: any
    ) {}
}

export default BlueboardClientModuleConfig;
