class BlueboardQRCode {
	constructor(
		public readonly id: number | string,
		public readonly created_at: string,
		public readonly updated_at: string,
		public readonly name: string,
		public readonly secret: string,
		public readonly image: string,
		public readonly pivot?: { code_id: number; product_id: number }
	) {}
}

export default BlueboardQRCode;
