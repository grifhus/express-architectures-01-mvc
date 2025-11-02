import { Request, Response, NextFunction } from "express";
import pino from "pino";
import { CustomError } from "@utils/errors";
import { config } from "@config/index";

/**
 * Logger instance for the error handler. Uses Pino for consistent logging.
 */
const logger = pino();

/**
 * Global error handling middleware for Express applications.
 * This middleware catches errors thrown by route handlers and other middleware,
 * formats them, and sends an appropriate HTTP response to the client.
 * It distinguishes between custom application errors and generic server errors.
 * Stack traces are only included in the response during development.
 * @param err The error object caught by the middleware.
 * @param req The Express request object.
 * @param res The Express response object.
 * @param _next The next middleware function (unused, but required by Express error middleware signature).
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Log the full error stack for debugging purposes
  logger.error(err.stack);

  // Determine the status code and message based on the error type
  const statusCode = err instanceof CustomError ? err.statusCode : 500;
  let message = err.message;

  // If it's a generic 500 error and not a custom one, use a generic message
  if (!(err instanceof CustomError) && statusCode === 500) {
    message = "An unexpected error occurred";
  }

  // Send the error response to the client
  res.status(statusCode).json({
    message: message,
    // Only send stacktrace in development for security reasons
    stack: config.nodeEnv === "development" ? err.stack : undefined,
  });
};
