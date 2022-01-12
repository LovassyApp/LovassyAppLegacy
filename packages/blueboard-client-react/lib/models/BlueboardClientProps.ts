class BlueboardClientProps {
    constructor(
        public readonly blueboardUrl: string,
        public readonly blueboardWsUrl: string,
        public readonly blueboardSocketKey: string
    ) {}
}

export default BlueboardClientProps;
