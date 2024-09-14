// src/services/LLMService.ts
// This file contains the LLMService class which is used to interpret voice commands.
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface InterpretedCommand {
  action: "add" | "update" | "remove" | "check";
  item: string;
  quantity?: number;
  unit?: string;
}

export async function interpretCommand(
  command: string
): Promise<InterpretedCommand> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are an AI assistant for a cafe inventory system. Parse the user's command and respond **only** with a valid JSON object containing the keys: action, item, quantity, and unit.",
      },
      { role: "user", content: command },
    ],
    temperature: 0,
  });

  const responseText = completion.choices[0]?.message?.content;

  if (!responseText) {
    throw new Error("No response from OpenAI API");
  }

  let result: InterpretedCommand;
  try {
    result = JSON.parse(responseText);
  } catch (error) {
    console.error("Failed to parse OpenAI response:", responseText);
    throw new Error("Failed to parse OpenAI response as JSON");
  }

  // Validate the result
  if (
    !result ||
    typeof result !== "object" ||
    !result.action ||
    !result.item ||
    !["add", "update", "remove", "check"].includes(result.action)
  ) {
    throw new Error("Invalid command interpretation");
  }

  return result;
}
