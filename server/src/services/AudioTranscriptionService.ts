// server/src/services/AudioTranscriptionService.ts
// This file contains the AudioTranscriptionService class which is used to transcribe audio files.
import OpenAI from "openai";
import fs from "fs/promises";
import path from "path";
import { createReadStream } from "fs";

const openai = new OpenAI();

export const transcribeAudioService = async (
  audioBuffer: Buffer
): Promise<string> => {
  let tempFilePath: string | null = null;

  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not set");
    }

    // Create a temporary file name with .wav extension
    const tempFileName = `temp_audio_${Date.now()}.wav`;
    tempFilePath = path.join(__dirname, "..", "..", "temp", tempFileName);

    // Ensure the temp directory exists
    await fs.mkdir(path.dirname(tempFilePath), { recursive: true });

    // Write the audio buffer to a temporary file
    await fs.writeFile(tempFilePath, audioBuffer);

    console.log(`Temporary audio file created: ${tempFilePath}`);

    // Call the OpenAI transcription API with the file path
    const response = await openai.audio.transcriptions.create({
      file: createReadStream(tempFilePath),
      model: "whisper-1",
    });

    console.log("OpenAI response received:", JSON.stringify(response, null, 2));

    if (typeof response.text === "string") {
      return response.text.trim();
    } else {
      throw new Error("Unexpected response format from OpenAI");
    }
  } catch (error) {
    console.error("OpenAI transcription error:", error);
    throw new Error(
      `Failed to transcribe audio: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  } finally {
    // Clean up the temporary file
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
        console.log(`Temporary audio file deleted: ${tempFilePath}`);
      } catch (unlinkError) {
        console.error("Error deleting temporary file:", unlinkError);
      }
    }
  }
};
