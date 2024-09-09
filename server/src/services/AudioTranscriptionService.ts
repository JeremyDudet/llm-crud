// server/src/services/AudioTranscriptionService.ts
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { setTimeout } from "timers/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Readable } from "stream";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const openai = new OpenAI();
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds
const MAX_CHUNK_SIZE = 25 * 1024 * 1024; // 25 MB in bytes

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

    let transcription = "";
    let offset = 0;

    while (offset < audioBuffer.length) {
      const chunkSize = Math.min(MAX_CHUNK_SIZE, audioBuffer.length - offset);
      const chunk = audioBuffer.slice(offset, offset + chunkSize);

      const chunkStream = new Readable();
      chunkStream.push(chunk);
      chunkStream.push(null);

      let retries = 0;
      while (retries < MAX_RETRIES) {
        try {
          const response = await openai.audio.transcriptions.create({
            file: new File([chunk], "audio.mp3", { type: "audio/mpeg" }),
            model: "whisper-1",
            response_format: "text",
          });

          console.log(
            "OpenAI response received for chunk:",
            JSON.stringify(response, null, 2)
          );

          if (typeof response === "string") {
            transcription += response + " ";
          } else if (
            response &&
            typeof response === "object" &&
            "text" in response
          ) {
            transcription += response.text + " ";
          } else {
            console.warn("Unexpected response format from OpenAI:", response);
          }

          break; // Success, exit retry loop
        } catch (error) {
          if (error instanceof OpenAI.APIConnectionError) {
            retries++;
            console.log(
              `Connection error, retrying chunk (${retries}/${MAX_RETRIES})...`
            );
            await setTimeout(RETRY_DELAY);
          } else {
            throw error;
          }
        }
      }

      if (retries === MAX_RETRIES) {
        throw new Error(
          `Failed to transcribe audio chunk after ${MAX_RETRIES} retries`
        );
      }

      offset += chunkSize;
    }

    return transcription.trim();
  } catch (error) {
    console.error("OpenAI transcription error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw new Error(
      "Failed to transcribe audio: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
};
