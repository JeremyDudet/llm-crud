import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import apiClient from "@/api/apiClient";
import { executeCommand } from "./commandStackSlice";

export const executeCommandStack = createAsyncThunk(
  "commandStack/execute",
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const commands = state.commandStack.commands;

    for (const command of commands) {
      try {
        const response = await apiClient.post("/api/voice-command", {
          command,
        });
        console.log("Command executed:", response.data);
        dispatch(executeCommand(command.id));
      } catch (error) {
        console.error("Error executing command:", error);
        // You might want to handle errors more gracefully here
      }
    }
  }
);
