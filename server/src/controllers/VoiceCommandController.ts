// src/controllers/VoiceCommandController.ts
// this controller will receive the audio file from the client, transcribe it, and then interpret the command
import { Request, Response } from "express";
import { transcribeAudioService } from "../services/AudioTranscriptionService";
import { interpretCommand } from "../services/LLMService";

export async function processCommand(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const audioBuffer = req.file?.buffer;

    if (!audioBuffer) {
      res.status(400).json({ error: "No audio file provided" });
      return;
    }

    console.log("Received audio buffer size:", audioBuffer.length);
    const transcription = await transcribeAudioService(audioBuffer);
    console.log("Transcription result:", transcription);

    // Use OpenAI API to interpret the command
    try {
      const interpretedCommand = await interpretCommand(transcription);

      // Return both the transcription and the interpreted command
      res.json({
        transcription,
        interpretedCommand,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.startsWith("Unclear command:")) {
          res.status(400).json({ error: error.message, transcription });
        } else {
          console.error("Error interpreting command:", error);
          res.status(500).json({
            error: "Internal server error",
            details: error.message,
            transcription,
          });
        }
      } else {
        res
          .status(500)
          .json({ error: "Unknown error occurred", transcription });
      }
    }
  } catch (error) {
    console.error("Error processing voice command:", error);
    res.status(500).json({
      error: "Error processing voice command",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
