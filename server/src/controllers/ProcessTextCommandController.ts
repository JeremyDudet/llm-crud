import { Request, Response } from "express";
import { preprocessText } from "../services/TextPreprocessingService";
import { interpretCommand } from "../services/TextInterpretationService";
import { validateCommand } from "../services/CommandValidationService";
import { executeCommand } from "../services/CommandExecutionService";
import { generateResponse } from "../services/ResponseGenerationService";

export async function processTextCommand(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { command } = req.body;

    // Preprocess the command
    const preprocessedText = await preprocessText(command);

    // Interpret the command
    const interpretedCommand = await interpretCommand(preprocessedText);

    // Validate the command
    const validationResult = validateCommand(interpretedCommand);

    if (!validationResult.isValid) {
      res.status(400).json({
        error: "Invalid command",
        details: validationResult.errors,
      });
      return;
    }

    // Execute the command
    const executionResult = await executeCommand(interpretedCommand);

    // Generate response
    const response = generateResponse(executionResult);

    res.json({ response });
  } catch (error) {
    console.error("Error processing text command:", error);
    res.status(500).json({
      error: "Error processing text command",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
