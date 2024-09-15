// server/src/services/AudioTranscriptionService.ts
// This file receives the audio buffer from the client, transcribes it, and returns the transcription
import OpenAI from "openai";
import fsPromises from "fs/promises";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const openai = new OpenAI();

// Get the current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const transcribeAudioService = async (
  audioBuffer: Buffer
): Promise<string> => {
  let tempFilePath: string | null = null;

  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not set");
    }

    // Create a temporary file name with .wav extension
    const tempFileName = `temp_audio_${Date.now()}.webm`;
    tempFilePath = path.join(__dirname, "..", "..", "temp", tempFileName);

    // Ensure the temp directory exists
    await fsPromises.mkdir(path.dirname(tempFilePath), { recursive: true });

    // Write the audio buffer to a temporary file
    await fsPromises.writeFile(tempFilePath, audioBuffer);

    console.log(`Temporary audio file created: ${tempFilePath}`);

    console.log(`Received audio buffer size: ${audioBuffer.length} bytes`);
    const stats = await fsPromises.stat(tempFilePath);
    console.log(`Written file size: ${stats.size} bytes`);

    if (stats.size === 0) {
      throw new Error("Audio file is empty");
    }

    console.log(`Attempting to transcribe file: ${tempFilePath}`);
    console.log(
      `File exists: ${await fsPromises
        .access(tempFilePath)
        .then(() => true)
        .catch(() => false)}`
    );

    console.log(
      "OpenAI API Key:",
      process.env.OPENAI_API_KEY ? "Set" : "Not set"
    );
    console.log("Temp file path:", tempFilePath);
    console.log("Audio buffer length:", audioBuffer.length);

    const fileStream = fs.createReadStream(tempFilePath);
    fileStream.on("error", (error) => {
      console.error("Error reading file:", error);
    });

    const response = await openai.audio.transcriptions.create({
      file: fileStream,
      model: "whisper-1",
      response_format: "json",
      language: "en",
    });
    console.log(`Transcription response:`, JSON.stringify(response, null, 2));

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
        await fsPromises.unlink(tempFilePath);
        console.log(`Temporary audio file deleted: ${tempFilePath}`);
      } catch (unlinkError) {
        console.error("Error deleting temporary file:", unlinkError);
      }
    }
  }
};
