class BlueboardLoginException extends Error {
	public errors: object = [];
	public isValidationError: boolean = false;
	constructor(errors: object, message: string, isValidationError: boolean) {
		super();
		this.errors = errors;
		this.message = message;
		this.isValidationError = isValidationError;
	}
}

export default BlueboardLoginException;
