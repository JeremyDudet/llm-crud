// src/routes/voiceCommandRoutes.ts
import express from "express";
import { processCommand } from "../controllers/VoiceCommandController";

const router = express.Router();

router.post("/", processCommand);

export default router;
