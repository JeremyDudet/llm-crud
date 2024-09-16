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
    updateCommand(
      state,
      action: PayloadAction<{
        id: string;
        changes: Partial<InterpretedCommand>;
      }>
    ) {
      const index = state.commands.findIndex(
        (command) => command.id === action.payload.id
      );
      if (index !== -1) {
        state.commands[index] = {
          ...state.commands[index],
          ...action.payload.changes,
        };
      }
    },
    cycleCommandForward(state) {
      if (state.commands.length > 0) {
        const [first, ...rest] = state.commands;
        state.commands = [...rest, first];
      }
    },
    cycleCommandBackward(state) {
      if (state.commands.length > 0) {
        const last = state.commands[state.commands.length - 1];
        state.commands = [last, ...state.commands.slice(0, -1)];
      }
    },
  },
});

export const {
  addCommand,
  removeCommand,
  executeCommand,
  updateCommand,
  cycleCommandForward,
  cycleCommandBackward,
} = commandStackSlice.actions;
export default commandStackSlice.reducer;
