import { BlueboardProduct } from '.';
import BlueboardTimestamps from './BlueboardTimestamps';

class BlueboardInventoryItem {
    constructor(
        public readonly id: number,
        public readonly timestamps: BlueboardTimestamps,
        public readonly usedAt: string,
        public readonly product: BlueboardProduct
    ) {}
}

export default BlueboardInventoryItem;
