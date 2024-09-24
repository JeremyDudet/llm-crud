// ## 2. Text Interpretation Service (NLP)

// Example Input: "Add a new task called 'Buy groceries' to my todo list"

// Example Output:
// ```json
// {
//   "operation": "create",
//   "entity": "task",
//   "data": {
//     "title": "Buy groceries",
//     "list": "todo"
//   }
// }

import OpenAI from "openai";
import { InterpretedCommand } from "../types/InterpretedCommand";
import { preprocessText } from "./TextPreprocessingService";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function interpretCommand(
  command: string
): Promise<InterpretedCommand> {
  const preprocessedText = preprocessText(command);

  const systemPrompt = `You are an AI assistant for a cafe inventory system.
    Parse the user's command and extract the following information:
    - action: "set", "add", or "subtract"
    - itemName: the name of the inventory item
    - quantity: the amount to be added, subtracted, or set
    - unitOfMeasure: the unit of measurement for the quantity

    Respond with a JSON object containing these fields.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: preprocessedText },
    ],
    temperature: 0.1,
  });

  const responseText = completion.choices[0]?.message?.content;

  if (!responseText) {
    throw new Error("No response from OpenAI API");
  }

  try {
    const interpretedCommand: InterpretedCommand = JSON.parse(responseText);
    return interpretedCommand;
  } catch (error) {
    console.error("Failed to parse OpenAI response:", responseText);
    throw new Error("Failed to interpret command");
  }
}
