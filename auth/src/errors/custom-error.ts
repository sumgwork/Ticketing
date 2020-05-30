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
