// src/routes/voiceCommandRoutes.ts
import express from "express";
import multer from "multer";
import { authenticateToken } from "../middleware/auth";
import { processCommand } from "../controllers/ProcessCommandController";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", authenticateToken, upload.single("audio"), processCommand);

export default router;
