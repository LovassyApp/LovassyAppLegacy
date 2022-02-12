import BlueboardQRCodePivot from './BlueboardQRCodePivot';
import BlueboardTimestamps from './BlueboardTimestamps';

class BlueboardQRCode {
    constructor(
        public readonly id: number,
        public readonly timestamps: BlueboardTimestamps,
        public readonly secret: string,
        public readonly name: string,
        public readonly image: string,
        public readonly email: string,
        public readonly pivot: BlueboardQRCodePivot
    ) {}
}

export default BlueboardQRCode;
