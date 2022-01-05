class BlueboardLoginException extends Error {
  public errors: object = [];
  public isWithCookie: boolean;
  constructor(errors: object, message: string, isWithCookie: boolean) {
    super();
    this.errors = errors;
    this.message = message;
    this.isWithCookie = isWithCookie;
  }
}

export default BlueboardLoginException;
