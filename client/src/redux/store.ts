import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import commandStackReducer from "../components/commandStack/commandStackSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    commandStack: commandStackReducer,
    // Add other reducers here as needed
  },
  devTools: process.env.NODE_ENV !== "production",
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
