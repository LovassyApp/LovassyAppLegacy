import BlueboardTimestamps from './BlueboardTimestamps';
import BlueboardInventoryItem from './BlueboardInventoryItem';

class BlueboardItemUse {
    constructor(
        public readonly id: number,
        public readonly timestamps: BlueboardTimestamps,
        public readonly values: { [key: string]: string | boolean },
        public readonly item?: BlueboardInventoryItem
    ) {}
}

export default BlueboardItemUse;
