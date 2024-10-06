import express from "express";
import UserController from "../controllers/UserController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

router.get("/", authenticateToken, UserController.getAllUsers);
router.get("/:id", authenticateToken, UserController.getUser);
router.put("/:id", authenticateToken, UserController.updateUser);
router.delete("/:id", authenticateToken, UserController.deleteUser);

export default router;
