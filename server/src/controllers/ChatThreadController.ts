import { Request, Response } from "express";
import {
  createChatThread,
  getChatThread,
  addMessageToChatThread,
} from "../services/ChatThreadService";

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export async function createNewChatThread(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const { message } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const newThread = await createChatThread(userId, message);
    res.status(201).json(newThread);
  } catch (error) {
    console.error("Error creating new chat thread:", error);
    res.status(500).json({ error: "Failed to create new chat thread" });
  }
}

export async function getChatThreadMessages(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const { threadId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const thread = await getChatThread(userId, parseInt(threadId, 10));
    if (!thread) {
      return res.status(404).json({ error: "Chat thread not found" });
    }
    res.json(thread.messages);
  } catch (error) {
    console.error("Error fetching chat thread messages:", error);
    res.status(500).json({ error: "Failed to fetch chat thread messages" });
  }
}

export async function addMessageToChatThreadHandler(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const { threadId } = req.params;
    const { message, role } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const updatedThread = await addMessageToChatThread(
      userId,
      parseInt(threadId, 10),
      message,
      role
    );
    res.json(updatedThread);
  } catch (error) {
    console.error("Error adding message to chat thread:", error);
    res.status(500).json({ error: "Failed to add message to chat thread" });
  }
}
