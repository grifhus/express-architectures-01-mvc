import { Request, Response, NextFunction } from "express";
import pino from "pino";

const logger = pino();

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logger.error(err.stack);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  res.json({
    message: err.message,
    // Only send stacktrace in development
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
