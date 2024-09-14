// src/controllers/AuthController.ts
import { Request, Response } from "express";
import AuthService from "../services/AuthService";
import { users } from "../database/schema";
import { db } from "../database";
import { eq } from "drizzle-orm";

interface AuthRequest extends Request {
  user?: { id: number };
}

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    try {
      const user = await AuthService.register(email, password);
      if (user) {
        res.status(201).json({
          message: "User registered successfully",
          user: {
            id: user.id,
            email: user.email,
          },
        });
      } else {
        res.status(400).json({ message: "Registration failed" });
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Email already in use") {
          res.status(409).json({ message: "Email already in use" });
        } else {
          res
            .status(400)
            .json({ message: "Registration failed", error: error.message });
        }
      } else {
        res.status(400).json({
          message: "Registration failed",
          error: "An unknown error occurred",
        });
      }
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    try {
      const result = await AuthService.login(email, password);
      if (result) {
        res.json({
          token: result.token,
          user: result.user,
        });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ message: "Login failed", error });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    // For token-based systems, we generally just remove the token on the client-side.
    res.json({ message: "Logout successful" });
  }

  async changePassword(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
      const success = await AuthService.changePassword(
        userId,
        currentPassword,
        newPassword
      );
      if (success) {
        res.json({ message: "Password changed successfully" });
      } else {
        res.status(400).json({ message: "Failed to change password" });
      }
    } catch (error) {
      res.status(500).json({ message: "Password change failed", error });
    }
  }

  async resetPasswordRequest(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    try {
      await AuthService.resetPasswordRequest(email);
      res.json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    } catch (error) {
      console.error("Password reset request error:", error);
      res.status(500).json({
        message: "An error occurred while processing your request.",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    const { token, newPassword } = req.body;
    try {
      const success = await AuthService.resetPassword(token, newPassword);
      if (success) {
        res.json({ message: "Password reset successful" });
      } else {
        res.status(400).json({ message: "Invalid or expired reset token" });
      }
    } catch (error) {
      console.error("Password reset error:", error);
      res
        .status(500)
        .json({ message: "An error occurred while resetting the password." });
    }
  }

  async verifyEmail(req: Request, res: Response): Promise<void> {
    const { token } = req.query;
    try {
      const success = await AuthService.verifyEmail(token as string);
      if (success) {
        res.json({ message: "Email verified successfully" });
      } else {
        res.status(400).json({ message: "Failed to verify email" });
      }
    } catch (error) {
      res.status(500).json({ message: "Email verification failed", error });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;
    try {
      const accessToken = await AuthService.refreshAccessToken(refreshToken);
      if (accessToken) {
        res.json({ accessToken });
      } else {
        res.status(401).json({ message: "Invalid refresh token" });
      }
    } catch (error) {
      res.status(500).json({ message: "Token refresh failed", error });
    }
  }

  async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, req.user.id))
        .get();
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.json({
        id: user.id,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching user data", error });
    }
  }
}

export default new AuthController();
