// server/src/services/AudioTranscriptionService.ts
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { setTimeout } from "timers/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const openai = new OpenAI();
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

export const transcribeAudioService = async (
  audioBuffer: Buffer
): Promise<string> => {
  let tempFilePath = "";
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error("Error: OpenAI API key is not set");
      throw new Error("OpenAI API key is not set");
    }
    console.log("Audio buffer size:", audioBuffer.length);

    // Write buffer to a temporary file
    tempFilePath = path.join(__dirname, "..", "..", "temp_audio.wav");
    fs.writeFileSync(tempFilePath, audioBuffer);
    console.log("Temporary file created:", tempFilePath);

    let retries = 0;
    while (retries < MAX_RETRIES) {
      try {
        const response = await openai.audio.transcriptions.create({
          file: fs.createReadStream(tempFilePath),
          model: "whisper-1",
          response_format: "text",
        });

        console.log(
          "OpenAI response received:",
          JSON.stringify(response, null, 2)
        );

        // Clean up the temporary file
        fs.unlinkSync(tempFilePath);

        if (typeof response === "string") {
          return response;
        } else if (
          response &&
          typeof response === "object" &&
          "text" in response
        ) {
          return response.text;
        } else {
          console.warn("Unexpected response format from OpenAI:", response);
          return "";
        }
      } catch (error) {
        if (error instanceof OpenAI.APIConnectionError) {
          retries++;
          console.log(
            `Connection error, retrying (${retries}/${MAX_RETRIES})...`
          );
          await setTimeout(RETRY_DELAY);
        } else {
          throw error;
        }
      }
    }
    throw new Error(`Failed to transcribe audio after ${MAX_RETRIES} retries`);
  } catch (error) {
    console.error("OpenAI transcription error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
      console.log("Temporary file cleaned up after error");
    }
    throw new Error(
      "Failed to transcribe audio: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
};
