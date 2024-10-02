import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient";

interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: number;
}

interface LLMChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

const initialState: LLMChatState = {
  messages: JSON.parse(localStorage.getItem("chatMessages") || "[]"),
  isLoading: false,
  error: null,
};

export const sendMessage = createAsyncThunk(
  "llmChat/sendMessage",
  async (message: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/api/llm-chat", { message });
      return response.data;
    } catch (error: unknown) {
      console.error("Error sending message:", error);
      return rejectWithValue("Failed to send message");
    }
  }
);

const llmChatSlice = createSlice({
  name: "llmChat",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
      localStorage.setItem("chatMessages", JSON.stringify(state.messages));
    },
    clearChat: (state) => {
      state.messages = [];
      localStorage.removeItem("chatMessages");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          content: action.payload.message,
          role: "assistant",
          timestamp: Date.now(),
        };
        state.messages.push(newMessage);
        localStorage.setItem("chatMessages", JSON.stringify(state.messages));
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addMessage, clearChat } = llmChatSlice.actions;
export default llmChatSlice.reducer;
