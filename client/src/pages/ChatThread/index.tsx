import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { setCurrentThreadId } from "@/features/ChatThread/ChatThreadSlice";
import LLMChat from "@/components/LLMChat";

function ChatThread() {
  const { threadId } = useParams<{ threadId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const currentThread = useSelector((state: RootState) =>
    state.chatThread.threads.find((thread) => thread.id === threadId)
  );

  useEffect(() => {
    if (threadId) {
      dispatch(setCurrentThreadId(threadId));
    }
  }, [dispatch, threadId]);

  if (!currentThread) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-y-auto p-4">
        {currentThread.messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block p-2 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {message.content}
            </span>
          </div>
        ))}
      </div>
      <div className="p-4">
        <LLMChat />
      </div>
    </div>
  );
}

export default ChatThread;
