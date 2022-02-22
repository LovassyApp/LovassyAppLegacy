import { BlueboardUserGroup } from ".";
import BlueboardUser from "./BlueboardUser";

class BlueboardControl {
    constructor(
        public readonly user: BlueboardUser,
        public readonly session: { [key: string]: any },
        public readonly permissions: Array<string>,
        public readonly groups: Array<BlueboardUserGroup>
    ) {}
}

export default BlueboardControl;
