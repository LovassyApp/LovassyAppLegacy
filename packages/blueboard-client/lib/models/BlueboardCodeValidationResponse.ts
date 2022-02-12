import { BlueboardInventoryItem } from '.';

class BlueboardCodeValidationResponse {
    constructor(public readonly codeName: string, public readonly usableItems: BlueboardInventoryItem[]) {}
}

export default BlueboardCodeValidationResponse;
