import BlueboardQRCode from './BlueboardQRCode';

class BlueboardProduct {
	constructor(
		public readonly codeActivated: boolean,
		public readonly codes: Array<BlueboardQRCode>,
		public readonly created_at: string,
		public readonly updated_at: string,
		public readonly description: string,
		public readonly id: number | string,
		public readonly imageName: string,
		public readonly imageUrl: string,
		public readonly inputs: string,
		public readonly markdownContent: string,
		public readonly price: number,
		public readonly quantity: number,
		public readonly visible: boolean
	) {}
}

export default BlueboardProduct;
