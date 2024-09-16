// src/services/LLMService.ts
// This file contains the LLMService class which is used to interpret voice commands.
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface InterpretedCommand {
  action: "add" | "update" | "remove" | "check";
  item: string;
  itemId: number;
  quantity?: number;
  unit?: string;
  userId: number;
  count: number;
}

export async function interpretCommand(
  command: string
): Promise<InterpretedCommand> {
  console.log("Received command:", command);

  if (command.trim().length < 2) {
    throw new Error("Unclear command: The command is too short or empty.");
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are an AI assistant for a cafe inventory system. Parse the user's command and respond with a valid JSON object containing the keys: action, item, quantity, and unit. If the command is unclear, incomplete, or not related to inventory management, respond with a JSON object containing an 'error' key and a description of what's missing or unclear.",
      },
      { role: "user", content: command },
    ],
    temperature: 0,
  });

  const responseText = completion.choices[0]?.message?.content;
  console.log("OpenAI response:", responseText);

  if (!responseText) {
    throw new Error("No response from OpenAI API");
  }

  let result: InterpretedCommand | { error: string };
  try {
    result = JSON.parse(responseText);
    console.log("Parsed result:", result);
  } catch (error) {
    console.error("Failed to parse OpenAI response:", responseText);
    throw new Error("Failed to parse OpenAI response as JSON");
  }

  if ("error" in result) {
    throw new Error(`Unclear command: ${result.error}`);
  }

  // Validate the result
  if (
    !result ||
    typeof result !== "object" ||
    !result.action ||
    !result.item ||
    !["add", "update", "remove", "check"].includes(result.action)
  ) {
    console.error("Invalid command interpretation:", result);
    throw new Error(
      "Invalid command interpretation: " + JSON.stringify(result)
    );
  }

  return result as InterpretedCommand;
}
