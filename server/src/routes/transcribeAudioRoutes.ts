// src/routes/transcribeAudioRoutes.ts
import express from "express";
import multer from "multer";
import { authenticateToken } from "../middleware/auth";
import { transcribeAudioController } from "../controllers/TranscribeAudioController";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/",
  authenticateToken,
  upload.single("audio"),
  transcribeAudioController
);

export default router;
