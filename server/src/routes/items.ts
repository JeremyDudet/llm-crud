import express from "express";
import { authenticateToken } from "../middleware/auth";
import ItemController from "../controllers/ItemController";

const router = express.Router();

// Get all items
router.get("/", authenticateToken, ItemController.getAllItems);

// Get a specific item by ID
router.get("/:id", authenticateToken, ItemController.getItem);

// Create a new item
router.post("/", authenticateToken, ItemController.createItem);

// Update an item by ID
router.put("/:id", authenticateToken, ItemController.updateItem);

// Delete an item by ID
router.delete("/:id", authenticateToken, ItemController.deleteItem);

export default router;
