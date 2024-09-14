import { Request, Response } from "express";
import { interpretCommand } from "../services/LLMService";
import { executeCommand } from "../services/InventoryService";

export async function processCommand(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { command } = req.body;

    if (!command || typeof command !== "string") {
      res.status(400).json({ error: "Invalid command format" });
      return;
    }

    // Use OpenAI API to interpret the command
    const interpretedCommand = await interpretCommand(command);

    // Execute the interpreted command
    const result = await executeCommand(interpretedCommand);

    res.json({ result });
  } catch (error) {
    console.error("Error processing voice command:", error);
    res.status(500).json({
      error: "Error processing voice command",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
