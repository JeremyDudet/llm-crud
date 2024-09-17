// src/services/LLMService.ts
// This file contains the LLMService class which is used to interpret voice commands.
import OpenAI from "openai";
import {
  ALLOWED_ACTIONS,
  fetchInventoryItems,
  fetchUnitOfMeasures,
} from "../config/constants";
import type { AllowedAction } from "../config/constants";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface InterpretedCommand {
  action: "set" | "add" | "subtract";
  itemName: string;
  itemId: number;
  quantity: number;
  unitOfMeasureId: number;
  unitOfMeasureName: string;
  userId?: number;
  count?: number;
  status: "valid" | "invalid";
  error?: string;
}

export async function interpretCommand(
  transcription: string
): Promise<InterpretedCommand[]> {
  console.log("Received transcription:", transcription);

  if (transcription.trim().length < 2) {
    throw new Error("Unclear command: The command is too short or empty.");
  }

  // Fetch current inventory items
  const inventoryItems = await fetchInventoryItems();
  const unitOfMeasures = await fetchUnitOfMeasures();
  const inventoryListForPrompt = inventoryItems.map((item) => ({
    itemId: item.id,
    itemName: item.name,
    // Get the item's unit of measure name from the unitOfMeasures array
    unitOfMeasureName:
      unitOfMeasures.find((uom) => uom.id === item.unitOfMeasureId)?.name ||
      "Unknown",
    unitOfMeasureId:
      unitOfMeasures.find((uom) => uom.id === item.unitOfMeasureId)?.id ||
      "Unknown",
  }));

  // Build system prompt
  const systemPrompt = `You are an AI assistant for a cafe inventory system.
    - Allowed actions: ${ALLOWED_ACTIONS.join(", ")}.
    - Inventory items: ${inventoryListForPrompt}.
    Parse the user's command and respond with a JSON array of objects.
    Each object should follow this structure: 
    {
      action: "set" | "add" | "subtract",
      itemName: string,
      itemId: number,
      quantity: number,
      unitOfMeasureId: number,
      unitOfMeasureName: string,
      confidence: number,
    }
    - action: one of the allowed actions.
    - itemName: an item from the inventory.
    - quantity: an integer or a floating-point number.
    - unitOfMeasureId: the id of the unit of measure.
    - unitOfMeasureName: the name of the unit of measure.
    - confidence: a number between 0 and 1 indicating the confidence in the interpretation.
    `;

  // Call the OpenAI API
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: transcription },
    ],
    temperature: 0.1,
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

  // Validate actions and items
  result = result.map((cmd) => {
    if (!ALLOWED_ACTIONS.includes(cmd.action)) {
      cmd.status = "invalid";
      cmd.error = `Invalid action: ${cmd.action}`;
    }
    if (
      !inventoryItems.some(
        (item) => item.id === cmd.itemId && item.name === cmd.itemName
      )
    ) {
      cmd.status = "invalid";
      cmd.error = `Item not found in inventory: ${cmd.itemName} (ID: ${cmd.itemId})`;
    }
    if (
      !unitOfMeasures.some(
        (uom) =>
          uom.id === cmd.unitOfMeasureId && uom.name === cmd.unitOfMeasureName
      )
    ) {
      cmd.status = "invalid";
      cmd.error = `Unit of measure not found in inventory: ${cmd.unitOfMeasureName} (ID: ${cmd.unitOfMeasureId})`;
    }
    return cmd;
  });

  // Filter out invalid commands or handle them accordingly

  return result;
}
