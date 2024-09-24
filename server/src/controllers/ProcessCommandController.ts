// src/controllers/VoiceCommandController.ts
// this controller will receive the audio file from the client, transcribe it, and then interpret the command
import { Request, Response } from "express";
import { transcribeAudio } from "../services/AudioTranscriptionService";
import { interpretCommand } from "../services/TextInterpretationService";
import { InterpretedCommand } from "../types/InterpretedCommand";

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
    const transcription = await transcribeAudio(audioBuffer);
    console.log("Transcription result:", transcription);

    console.log("Interpreting transcription...");
    const interpretedCommands = await interpretCommand(transcription);
    console.log("Interpreted commands:", interpretedCommands);

    if (interpretedCommands.length === 0) {
      res.status(400).json({
        error: "Unclear command",
        message:
          "Could not interpret the command. Please try again with a clearer instruction.",
      });
      return;
    }

    const invalidCommands = interpretedCommands.filter(
      (cmd) => cmd.status === "invalid"
    );
    if (invalidCommands.length > 0) {
      res.status(400).json({
        error: "Invalid commands",
        invalidCommands,
        message: "Some commands were invalid. Please check and try again.",
      });
      return;
    }

    res.json({
      transcription,
      interpretedCommands,
    });
  } catch (error) {
    console.error("Error processing voice command:", error);
    res.status(500).json({
      error: "Error processing voice command",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
