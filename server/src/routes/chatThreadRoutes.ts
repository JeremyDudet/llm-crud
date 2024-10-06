import express from "express";
import {
  createNewChatThread,
  getChatThreadMessages,
  addMessageToChatThreadHandler,
} from "../controllers/ChatThreadController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

router.post("/threads", authenticateToken, createNewChatThread);
router.get("/threads/:threadId", authenticateToken, getChatThreadMessages);
router.post(
  "/threads/:threadId/messages",
  authenticateToken,
  addMessageToChatThreadHandler
);

export default router;
