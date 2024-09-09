// src/controllers/VoiceCommandController.ts
import { Request, Response } from "express";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export class VoiceCommandController {
  async processCommand(req: Request, res: Response): Promise<void> {
    try {
      const { command } = req.body;

      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that interprets voice commands for a CRUD application.",
          },
          { role: "user", content: command },
        ],
        model: "gpt-4o",
      });

      const interpretedCommand = completion.choices[0].message.content;

      // Process the interpreted command and perform CRUD operation
      const result = await this.executeCRUDOperation(interpretedCommand ?? "");

      res.json({ result });
    } catch (error) {
      res.status(500).json({ error: "Error processing voice command" });
    }
  }

  private async executeCRUDOperation(command: string): Promise<any> {
    // Implement logic to execute CRUD operations based on the interpreted command
    // This might involve calling other services or directly interacting with the database
    // Return the result of the operation
  }
}

export default new VoiceCommandController();
