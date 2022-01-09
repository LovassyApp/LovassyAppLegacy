class BlueboardLoginException extends Error {
  public errors: object = [];
  public isKretaError: boolean = false;
  constructor(errors: object, message: string, isKretaError: boolean) {
    super();
    this.errors = errors;
    this.message = message;
    this.isKretaError = isKretaError;
  }
}

export default BlueboardLoginException;
