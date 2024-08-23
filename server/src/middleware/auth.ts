// src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import AuthService from "../services/AuthService";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Extract the Authorization header from the request
  const authHeader = req.headers["authorization"];
  // Split the header and get the token (Bearer token format)
  const token = authHeader && authHeader.split(" ")[1];

  // If no token is provided, return 401 Unauthorized
  if (token == null) return res.sendStatus(401);

  // Verify the token using the AuthService
  const user = AuthService.verifyToken(token);
  // If the token is invalid or expired, return 403 Forbidden
  if (user == null) return res.sendStatus(403);

  // TypeScript note: 'user' property needs to be added to the Request type
  // Attach the user object to the request for use in subsequent middleware or routes
  (req as any).user = user;
  // Call the next middleware or route handler
  next();
};
