import { config } from "@config/index";
import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { UnauthorizedError, InternalServerError } from "@utils/errors";
import { User } from "@models/User"; // Assuming User model is used for req.user

/**
 * Extends the Express Request interface to include a `user` property.
 * This interface is used for requests that have passed through authentication middleware.
 */
export interface AuthenticatedRequest extends Request {
  /**
   * The authenticated user object, populated by the `authMiddleware`.
   */
  user: User; // Make user property mandatory
}

/**
 * Middleware to authenticate requests using JSON Web Tokens (JWT).
 * It checks for a valid JWT in the Authorization header and attaches the decoded user information to the request object.
 * @param req The Express request object.
 * @param res The Express response object.
 * @param next The next middleware function in the stack.
 * @throws {UnauthorizedError} If the authorization header is missing/malformed or the token is invalid/expired.
 * @throws {InternalServerError} If the JWT secret is not configured.
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Authorization header missing or malformed"));
  }

  const token = authHeader.split(" ")[1];
  const jwtSecret = config.jwt.secret;

  if (!jwtSecret) {
    return next(new InternalServerError("JWT secret is not configured"));
  }

  try {
    const decoded = verify(token, jwtSecret) as { id: string; email: string };
    (req as AuthenticatedRequest).user = decoded as User; // Attach decoded user to request
    next();
  } catch (error) {
    return next(new UnauthorizedError("Invalid or expired token"));
  }
};
