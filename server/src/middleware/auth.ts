// src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import AuthService from "../services/AuthService";
import { User } from "../database/schema";

interface AuthRequest extends Request {
  user?: { id: number };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  const decodedToken = AuthService.verifyToken(token);
  if (decodedToken == null) return res.sendStatus(403);

  req.user = { id: decodedToken.id };
  next();
};

interface AuthenticatedRequest extends Request {
  user?: typeof User;
}

export const requireRole = (roles: string | string[]) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.user?.role.name && allowedRoles.includes(req.user.role.name)) {
      next();
    } else {
      res.status(403).json({ message: "Access denied" });
    }
  };
};
