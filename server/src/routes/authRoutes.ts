// src/routes/authRoutes.ts
import express from "express";
import AuthController from "../controllers/AuthController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// Handle user registration
router.post("/register", AuthController.register);
// POST /api/auth/register
// Body: { "email": "user@example.com", "password": "password123", "name": "User Name" }

// Handle user login
router.post("/login", AuthController.login);
// POST /api/auth/login
// Body: { "email": "user@example.com", "password": "password123" }

// Handle user logout (requires authentication)
router.post("/logout", authenticateToken, AuthController.logout);
// POST /api/auth/logout
// Headers: { "Authorization": "Bearer <token>" }

// Handle password change (requires authentication)
router.post(
  "/change-password",
  authenticateToken,
  AuthController.changePassword
);
// POST /api/auth/change-password
// Headers: { "Authorization": "Bearer <token>" }
// Body: { "currentPassword": "oldPassword123", "newPassword": "newPassword456" }

// Handle password reset request
router.post("/reset-password-request", AuthController.resetPasswordRequest);
// POST /api/auth/reset-password-request
// Body: { "email": "user@example.com" }

// Handle password reset
router.post("/reset-password", AuthController.resetPassword);
// POST /api/auth/reset-password
// Body: { "token": "resetToken123", "newPassword": "newPassword456" }

// Handle email verification
router.get("/verify-email", AuthController.verifyEmail);
// GET /api/auth/verify-email
// Query: { "token": "verificationToken123" }

// Handle refresh token
router.post("/refresh-token", AuthController.refreshToken);

// Handle fetching current user data
router.get("/me", authenticateToken, AuthController.getCurrentUser);

export default router;
