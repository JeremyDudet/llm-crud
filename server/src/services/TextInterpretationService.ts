// src/services/LLMService.ts
// This file contains the LLMService class which is used to interpret voice commands.
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface InterpretedCommand {
  action: "add" | "update" | "remove" | "check" | "inventory" | "set";
  item: string;
  itemId?: number;
  quantity?: number;
  unit?: string;
  userId?: number;
  count?: number;
  status: "valid" | "inferred" | "invalid";
  originalCommand?: string;
}

export async function interpretCommand(
  command: string
): Promise<InterpretedCommand[]> {
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
          "You are an AI assistant for a cafe inventory system. Parse the user's command and respond with a valid JSON array of objects. Each object should contain the keys: action, item, quantity, unit, and status. The status should be 'valid' for clear commands, 'inferred' for commands where you had to make assumptions, and 'invalid' for commands you couldn't understand. For 'invalid' commands, include an 'error' key explaining the issue.",
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

  let result: InterpretedCommand[];
  try {
    result = JSON.parse(responseText);
    console.log("Parsed result:", result);
  } catch (error) {
    console.error("Failed to parse OpenAI response:", responseText);
    throw new Error("Failed to parse OpenAI response as JSON");
  }

  if (!Array.isArray(result)) {
    throw new Error("Invalid response format: expected an array of commands");
  }

  // Transform "inventory" and "set" actions to "update"
  result = result.map((command) => ({
    ...command,
    action: ["inventory", "set"].includes(command.action)
      ? "update"
      : command.action,
    originalCommand: command.originalCommand || JSON.stringify(command),
  }));

  return result;
}
