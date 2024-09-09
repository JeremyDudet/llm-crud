import { Request, Response } from "express";
import { transcribeAudioService } from "../services/AudioTranscriptionService";

export const transcribeAudio = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file provided" });
    }

    const audioBuffer = req.file.buffer;
    const transcription = await transcribeAudioService(audioBuffer);

    res.json({ text: transcription });
  } catch (error) {
    console.error("Transcription error:", error);
    if (error instanceof Error) {
      res.json({ error: error.message });
    }
  }
};
