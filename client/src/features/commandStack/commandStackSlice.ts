import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InterpretedCommand } from "@/types/InterpretedCommand";

interface CommandStackState {
  commands: InterpretedCommand[];
}

const initialState: CommandStackState = {
  commands: [],
};

const commandStackSlice = createSlice({
  name: "commandStack",
  initialState,
  reducers: {
    addCommand(state, action: PayloadAction<InterpretedCommand>) {
      state.commands.push(action.payload);
    },
    removeCommand(state, action: PayloadAction<string>) {
      state.commands = state.commands.filter(
        (command) => command.id !== action.payload
      );
    },
    executeCommand(state, action: PayloadAction<string>) {
      const command = state.commands.find((cmd) => cmd.id === action.payload);
      if (command) {
        command.processed = true;
      }
    },
  },
});

export const { addCommand, removeCommand, executeCommand } =
  commandStackSlice.actions;
export default commandStackSlice.reducer;
