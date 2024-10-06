import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import commandStackReducer from "./features/commandStackSlice";
import chatReducer from "./features/llmChat/llmChatSlice";
import chatThreadReducer from "./features/ChatThread/ChatThreadSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    commandStack: commandStackReducer,
    chat: chatReducer,
    chatThread: chatThreadReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
