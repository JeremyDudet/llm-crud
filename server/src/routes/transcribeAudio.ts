import express from "express";
import multer from "multer";
import { authenticateToken } from "../middleware/auth";
import { transcribeAudio } from "../controllers/TranscribeAudioController";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", authenticateToken, upload.single("audio"), transcribeAudio);

export default router;
