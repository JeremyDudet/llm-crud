import { Request, Response } from "express";
import { transcribeAudio } from "../services/AudioTranscriptionService";

export async function transcribeAudioController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const audioBuffer = req.file?.buffer;

    if (!audioBuffer) {
      res.status(400).json({ error: "No audio file provided" });
      return;
    }

    const transcription = await transcribeAudio(audioBuffer);
    res.json({ transcription });
  } catch (error) {
    console.error("Error transcribing audio:", error);
    res.status(500).json({
      error: "Error transcribing audio",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
