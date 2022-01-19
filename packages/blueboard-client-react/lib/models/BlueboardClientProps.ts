class BlueboardClientProps {
    constructor(
        public readonly blueboardUrl: string,
        public readonly blueboardWsUrl: string,
        public readonly blueboardSocketKey: string,
        public readonly cookies: boolean
    ) {}
}

export default BlueboardClientProps;
