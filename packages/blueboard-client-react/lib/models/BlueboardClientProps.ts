class BlueboardClientProps {
    constructor(
        public readonly blueboardUrl: string,
        public readonly blueboardWsUrl: string,
        public readonly blueboardSocketKey: string,
        public readonly cookies: boolean,
        public readonly wsDisconnectCallback?: (event: any) => void,
        public readonly wsConnectCallback?: (event: any) => void
    ) {}
}

export default BlueboardClientProps;
