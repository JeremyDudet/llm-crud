import { Request, Response, NextFunction } from "express";
import User from "../database/models/User";

interface AuthenticatedRequest extends Request {
  user?: User;
}

export const requireRole = (roles: string | string[]) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.user && allowedRoles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ message: "Access denied" });
    }
  };
};
