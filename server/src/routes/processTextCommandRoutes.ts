// src/routes/processTextCommandRoutes.ts
import express from "express";
import { authenticateToken } from "../middleware/auth";
import { processTextCommand } from "../controllers/ProcessTextCommandController";

const router = express.Router();

router.post("/", authenticateToken, processTextCommand);

export default router;
