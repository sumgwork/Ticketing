import { CustomError } from "./custom-error";
export class NotAuthorisedError extends CustomError {
  reason = "Not Authorised";
  statusCode = 401;

  constructor() {
    super("Not Authorised");

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, NotAuthorisedError.prototype);
  }

  serializeErrors() {
    const formattedErrors = [
      {
        message: this.reason,
      },
    ];
    return formattedErrors;
  }
}
