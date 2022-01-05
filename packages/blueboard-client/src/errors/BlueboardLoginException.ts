class BlueboardLoginException extends Error {
  public errors: object = [];
  constructor(errors: object, message: string) {
    super();
    this.errors = errors;
    this.message = message;
  }
}

export default BlueboardLoginException;
