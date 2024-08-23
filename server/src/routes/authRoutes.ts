// src/routes/authRoutes.ts
import express from "express";
import AuthController from "../controllers/AuthController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// Handle user login
router.post("/login", AuthController.login);
// Example API call:
// POST /api/auth/login
// Body: { "email": "user@example.com", "password": "password123" }

// Handle user logout (requires authentication)
router.post("/logout", authenticateToken, AuthController.logout);
// Example API call:
// POST /api/auth/logout
// Headers: { "Authorization": "Bearer <token>" }

// Handle password change (requires authentication)
router.post(
  "/change-password",
  authenticateToken,
  AuthController.changePassword
);
// Example API call:
// POST /api/auth/change-password
// Headers: { "Authorization": "Bearer <token>" }
// Body: { "currentPassword": "oldPassword123", "newPassword": "newPassword456" }

export default router;
