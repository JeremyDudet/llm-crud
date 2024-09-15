// src/routes/voiceCommandRoutes.ts
import express from "express";
import multer from "multer";
import { processCommand } from "../controllers/VoiceCommandController";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("audio"), processCommand);

export default router;
