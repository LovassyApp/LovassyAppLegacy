class BlueboardUserGroup {
    constructor(
        public readonly id: number | string,
        public readonly name: string,
        public readonly permissions: Array<string>,
        public readonly created_at?: string,
        public readonly updated_at?: string
    ) {}
}

export default BlueboardUserGroup;
