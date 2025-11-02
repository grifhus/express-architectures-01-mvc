
/**
 * @file Defines custom error classes used throughout the application.
 * These custom errors extend the native Error class and include an HTTP status code,
 * allowing for standardized error handling and more descriptive API responses.
 */

/**
 * Base custom error class for the application.
 * All other custom errors should extend this class.
 */
export class CustomError extends Error {
  /**
   * The HTTP status code associated with this error.
   */
  statusCode: number;

  /**
   * Creates an instance of CustomError.
   * @param message The error message.
   * @param statusCode The HTTP status code (defaults to 500).
   */
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    // Set the prototype explicitly to ensure correct inheritance when transpiled to ES5/6
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

/**
 * Represents an HTTP 400 Bad Request error.
 * Indicates that the server cannot or will not process the request due to something that is perceived to be a client error.
 */
export class BadRequestError extends CustomError {
  /**
   * Creates an instance of BadRequestError.
   * @param message The error message (defaults to "Bad Request").
   */
  constructor(message: string = "Bad Request") {
    super(message, 400);
    this.name = "BadRequestError";
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

/**
 * Represents an HTTP 401 Unauthorized error.
 * Indicates that the request has not been applied because it lacks valid authentication credentials for the target resource.
 */
export class UnauthorizedError extends CustomError {
  /**
   * Creates an instance of UnauthorizedError.
   * @param message The error message (defaults to "Unauthorized").
   */
  constructor(message: string = "Unauthorized") {
    super(message, 401);
    this.name = "UnauthorizedError";
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

/**
 * Represents an HTTP 403 Forbidden error.
 * Indicates that the server understood the request but refuses to authorize it.
 */
export class ForbiddenError extends CustomError {
  /**
   * Creates an instance of ForbiddenError.
   * @param message The error message (defaults to "Forbidden").
   */
  constructor(message: string = "Forbidden") {
    super(message, 403);
    this.name = "ForbiddenError";
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

/**
 * Represents an HTTP 404 Not Found error.
 * Indicates that the server cannot find the requested resource.
 */
export class NotFoundError extends CustomError {
  /**
   * Creates an instance of NotFoundError.
   * @param message The error message (defaults to "Not Found").
   */
  constructor(message: string = "Not Found") {
    super(message, 404);
    this.name = "NotFoundError";
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Represents an HTTP 500 Internal Server Error.
 * Indicates that the server encountered an unexpected condition that prevented it from fulfilling the request.
 */
export class InternalServerError extends CustomError {
  /**
   * Creates an instance of InternalServerError.
   * @param message The error message (defaults to "Internal Server Error").
   */
  constructor(message: string = "Internal Server Error") {
    super(message, 500);
    this.name = "InternalServerError";
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}
