// src/controllers/AuthController.ts
import { Request, Response } from "express";
import AuthService from "../services/AuthService";

// Add this interface
interface AuthRequest extends Request {
  user?: { id: number };
}

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    const token = await AuthService.login(username, password);
    if (token) {
      res.json({ token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    // In a token-based auth system, logout is typically handled client-side
    // by removing the token. However, we can create a server-side logout
    // for demonstration purposes.
    res.json({ message: "Logout successful" });
  }

  async changePassword(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id; // Assuming the user object is attached to the request by the auth middleware
    const { oldPassword, newPassword } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const success = await AuthService.changePassword(
      userId,
      oldPassword,
      newPassword
    );
    if (success) {
      res.json({ message: "Password changed successfully" });
    } else {
      res.status(400).json({ message: "Failed to change password" });
    }
  }
}

export default new AuthController();
