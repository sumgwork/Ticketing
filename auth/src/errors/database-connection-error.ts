import { CustomError } from "./custom-error";
export class DatabaseConnectionError extends CustomError {
  reason = "Error connecting to database";
  statusCode = 500;

  constructor() {
    super("Error connecting to Database");

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
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
