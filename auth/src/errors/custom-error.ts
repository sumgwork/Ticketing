/**
 * Reason for choosing abstract class over an Interface
 * here is that with an abstract class, we can later call
 * instanceOf to check whether the object is an instance of
 * this common class.
 */
export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract serializeErrors(): {
    message: string;
    field?: string;
  }[];

  constructor(errorMessage: string) {
    super(errorMessage);
    // Only because we are extending a built in class
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
