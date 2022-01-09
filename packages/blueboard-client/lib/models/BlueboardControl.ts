import BlueboardUser from './BlueboardUser';

class BlueboardControl {
	constructor(
		public readonly user: BlueboardUser,
		public readonly session: { [key: string]: any },
		public readonly permissions: Array<String>
	) {}
}

export default BlueboardControl;
