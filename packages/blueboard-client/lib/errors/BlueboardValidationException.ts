class BlueboardValidationException extends Error {
	public errors: object = [];

	constructor(errors: object, message: string) {
		super(message);
		this.errors = errors;
	}
}

export default BlueboardValidationException;
