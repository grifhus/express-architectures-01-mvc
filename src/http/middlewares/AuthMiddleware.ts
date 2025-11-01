import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

// Extend the Express Request interface to include a user property
export interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string };
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization header missing or malformed" });
  }

  const token = authHeader.split(" ")[1];
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return res.status(500).json({ message: "JWT secret is not configured" });
  }

  try {
    const decoded = verify(token, jwtSecret) as { id: string; email: string };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
