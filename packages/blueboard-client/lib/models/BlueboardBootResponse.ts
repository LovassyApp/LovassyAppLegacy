import { BlueboardInventoryItem } from '.';
import BlueboardKretaGradeData from './BlueboardKretaGradeData';
import BlueboardLoloRequest from './BlueboardLoloRequest';
import BlueboardLoloResponse from './BlueboardLoloResponse';
import BlueboardProduct from './BlueboardProduct';

class BlueboardBootResponse {
    constructor(
        public readonly requests?: BlueboardLoloRequest[],
        public readonly inventory?: BlueboardInventoryItem[],
        public readonly grades?: BlueboardKretaGradeData[],
        public readonly store?: BlueboardProduct[],
        public readonly lolo?: BlueboardLoloResponse
    ) {}
}

export default BlueboardBootResponse;
