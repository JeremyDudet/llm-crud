// src/routes/userRoutes.ts
import express from "express";
import UserController from "../controllers/UserController";

const router = express.Router();

// Create a new user
router.post("/", UserController.createUser);

// Get all users
router.get("/", UserController.getAllUsers);

// Get a specific user by ID
router.get("/:id", UserController.getUser);

// Update a user by ID
router.put("/:id", UserController.updateUser);

// Delete a user by ID
router.delete("/:id", UserController.deleteUser);

export default router;
