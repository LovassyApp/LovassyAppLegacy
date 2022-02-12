class BlueboardProductInput {
    constructor(
        public readonly name: string,
        public readonly type: 'textbox' | 'boolean',
        public readonly title: string
    ) {}
}

export default BlueboardProductInput;
