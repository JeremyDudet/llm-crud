// src/store/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  // Define your user state here
}

const initialState: UserState = {
  // Initialize your state
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Define your reducers here
  },
});

export const {
  /* your actions */
} = userSlice.actions;
export default userSlice.reducer;
