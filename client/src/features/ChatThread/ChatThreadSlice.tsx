import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient";

interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: number;
}

interface ChatThread {
  id: string;
  messages: ChatMessage[];
  createdAt: number;
}

interface ChatThreadsState {
  threads: ChatThread[];
  currentThreadId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ChatThreadsState = {
  threads: [],
  currentThreadId: null,
  isLoading: false,
  error: null,
};

export const createNewThread = createAsyncThunk(
  "chatThreads/createNewThread",
  async (message: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/api/chat/threads", { message });
      return response.data;
    } catch (error: unknown) {
      console.error("Error creating new thread:", error);
      return rejectWithValue("Failed to create new thread");
    }
  }
);

const chatThreadSlice = createSlice({
  name: "chatThreads",
  initialState,
  reducers: {
    setCurrentThreadId: (state, action: PayloadAction<string>) => {
      state.currentThreadId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewThread.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNewThread.fulfilled, (state, action) => {
        state.isLoading = false;
        state.threads.push(action.payload);
        state.currentThreadId = action.payload.id;
      })
      .addCase(createNewThread.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentThreadId } = chatThreadSlice.actions;
export default chatThreadSlice.reducer;
