import { BlueboardTimestamps, BlueboardUser } from '.';

class BlueboardLoloRequest {
    constructor(
        public readonly id: number,
        public readonly title: string,
        public readonly body: string,
        public readonly timestamps: BlueboardTimestamps,
        public readonly acceptedAt?: string,
        public readonly deniedAt?: string,
        public readonly user?: BlueboardUser
    ) {}
}

export default BlueboardLoloRequest;
