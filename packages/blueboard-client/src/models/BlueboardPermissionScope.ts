class BlueboardPermissionScope {
	constructor(
		public readonly scopeDisplayName: string,
		public readonly scopeName: string,
		public readonly permissions: Array<string>
	) {}
}

export default BlueboardPermissionScope;
