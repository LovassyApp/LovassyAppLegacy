import { BlueboardItemUse, BlueboardProduct, BlueboardTimestamps } from '.';

class BlueboardInventoryItem {
    constructor(
        public readonly id: number,
        public readonly timestamps: BlueboardTimestamps,
        public readonly usedAt: string,
        public readonly product: BlueboardProduct,
        public readonly itemUse?: BlueboardItemUse
    ) {}
}

export default BlueboardInventoryItem;
