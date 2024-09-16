// src/controllers/VoiceCommandController.ts
// this controller will receive the audio file from the client, transcribe it, and then interpret the command
import { Request, Response } from "express";
import { transcribeAudio } from "../services/AudioTranscriptionService";
import { interpretCommand } from "../services/TextInterpretationService";
import { autocompleteTranscription } from "../services/AutoCompleteTranscriptionService";

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

    const interpretedCommands = await interpretCommand(transcription);

    res.json({
      transcription,
      interpretedCommands,
      suggestedTranscription: await autocompleteTranscription(transcription),
    });
  } catch (error) {
    console.error("Error processing voice command:", error);
    res.status(500).json({
      error: "Error processing voice command",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

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
