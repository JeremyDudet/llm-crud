import { db } from "../database";
import { chatThreads, chatMessages } from "../database/schema";
import { eq, and } from "drizzle-orm";

type ChatThread = typeof chatThreads.$inferSelect;
type ChatMessage = typeof chatMessages.$inferSelect;
type NewChatThread = typeof chatThreads.$inferInsert;
type NewChatMessage = typeof chatMessages.$inferInsert;

export async function createChatThread(userId: string, initialMessage: string) {
  const threadId = await db.transaction(async (tx) => {
    const [newThread] = await tx
      .insert(chatThreads)
      .values({
        userId,
        createdAt: new Date(),
      } as NewChatThread)
      .returning({ id: chatThreads.id })
      .execute();

    await tx
      .insert(chatMessages)
      .values({
        threadId: newThread.id,
        content: initialMessage,
        role: "user",
        timestamp: new Date(),
      } as NewChatMessage)
      .execute();

    return newThread.id;
  });

  return getChatThread(userId, threadId);
}

export async function getChatThread(
  userId: string,
  threadId: number
): Promise<(ChatThread & { messages: ChatMessage[] }) | null> {
  const thread = await db
    .select()
    .from(chatThreads)
    .where(and(eq(chatThreads.id, threadId), eq(chatThreads.userId, userId)))
    .execute();

  if (thread.length === 0) {
    return null;
  }

  const messages = await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.threadId, threadId))
    .orderBy(chatMessages.timestamp)
    .execute();

  return {
    ...thread[0],
    messages,
  };
}

export async function addMessageToChatThread(
  userId: string,
  threadId: number,
  content: string,
  role: "user" | "assistant"
) {
  await db
    .insert(chatMessages)
    .values({
      threadId,
      content,
      role,
      timestamp: new Date(),
    } as NewChatMessage)
    .execute();

  return getChatThread(userId, threadId);
}
