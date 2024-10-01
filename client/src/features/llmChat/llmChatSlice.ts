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
  messages: [],
  isLoading: false,
  error: null,
};

export const sendMessage = createAsyncThunk(
  "llmChat/sendMessage",
  async (message: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/api/llm-chat", { message });
      return response.data;
    } catch (error) {
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
    },
    clearChat: (state) => {
      state.messages = [];
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
        state.messages.push({
          id: Date.now().toString(),
          content: action.payload.message,
          role: "assistant",
          timestamp: Date.now(),
        });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addMessage, clearChat } = llmChatSlice.actions;
export default llmChatSlice.reducer;
