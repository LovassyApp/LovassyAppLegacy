import BlueboardQRCode from "./BlueboardQRCode";
import BlueboardTimestamps from "./BlueboardTimestamps";
import BlueboardProductInput from "./BlueboardProductInput";
import { BlueboardUserGroup } from ".";

class BlueboardProduct {
    constructor(
        public readonly id: number | string,
        public readonly timestamps: BlueboardTimestamps,
        public readonly name: string,
        public readonly description: string,
        public readonly markdownContent: string,
        public readonly codeActivated: boolean,
        public readonly price: number,
        public readonly quantity: number,
        public readonly inputs: Array<BlueboardProductInput>,
        public readonly imageName: string,
        public readonly visible: boolean,
        public readonly imageUrl: string,
        public readonly codeNames: Array<string>,
        public readonly codes?: Array<BlueboardQRCode>,
        public readonly notifiedMails?: string,
        public readonly notifiedGroups?: Array<BlueboardUserGroup>
    ) {}
}

export default BlueboardProduct;
