import BlueboardTimestamps from './BlueboardTimestamps';

class BlueboardUser {
	constructor(
		public readonly id: number,
		public readonly name: string,
		public readonly email: string,
		public readonly timestamps: BlueboardTimestamps,
		public readonly balance: number,
		public readonly groups: Array<number>
	) {}
}

export default BlueboardUser;
