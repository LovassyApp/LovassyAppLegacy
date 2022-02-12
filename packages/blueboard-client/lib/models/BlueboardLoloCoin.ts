import BlueboardTimestamps from './BlueboardTimestamps';
import BlueboardLoloReason from './BlueboardLoloReason';
import BlueboardKretaGrade from './BlueboardKretaGrade';

class BlueboardLoloCoin {
    constructor(
        public readonly id: number,
        public readonly timestamps: BlueboardTimestamps,
        public readonly userId: number,
        public readonly historyId: number,
        public readonly isSpent: boolean,
        public readonly reason: BlueboardLoloReason,
        public readonly grades: Array<BlueboardKretaGrade>,
        public readonly reasonText: string
    ) {}
}

export default BlueboardLoloCoin;
