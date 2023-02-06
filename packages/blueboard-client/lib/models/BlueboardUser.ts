import { BlueboardUserGroup } from '.';
import BlueboardTimestamps from './BlueboardTimestamps';

class BlueboardUser {
    constructor(
        public readonly id: number | string,
        public readonly name: string,
        public readonly email: string,
        public readonly groups: Array<number> | Array<BlueboardUserGroup>,
        public readonly timestamps?: BlueboardTimestamps,
        public readonly balance?: number,
        public readonly schoolClass?: string,
        public readonly realName?: string
    ) {}
}

export default BlueboardUser;
