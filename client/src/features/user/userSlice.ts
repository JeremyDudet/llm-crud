import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../api/apiClient";
import { RootState } from "../../store";

interface User {
  id: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  token: string;
  name: string;
}

interface Payload {
  token: string;
  id: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  name: string; // Add this line
}

interface UserState {
  currentUserId: string | null;
  currentUserEmail: string | null;
  currentUserName: string | null;
  role: string | null;
  token: string | null;
  isLoading: boolean;
  isEmailVerified: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUserId: null,
  currentUserEmail: null,
  currentUserName: null,
  role: null,
  token: localStorage.getItem("token"),
  isLoading: false,
  error: null,
  isEmailVerified: false,
};

export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (_, { getState, rejectWithValue }) => {
    const { user } = getState() as RootState;
    const token = user.token || localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token found");
    }
    try {
      const response = await apiClient.get("/api/auth/me");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch user data"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Payload>) => {
      console.log("setUser reducer called", action.payload);
      state.currentUserId = action.payload.id;
      state.currentUserEmail = action.payload.email;
      state.currentUserName = action.payload.name;
      state.isLoading = false;
      state.error = null;
      state.role = action.payload.role;
      state.isEmailVerified = action.payload.isEmailVerified;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearUser: (state) => {
      state.currentUserId = null;
      state.currentUserEmail = null;
      state.currentUserName = null;
      state.role = null;
      state.isEmailVerified = false;
      state.token = null;
      localStorage.removeItem("token");
    },
    initializeAuth: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isLoading = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.currentUserId = action.payload.id;
        state.currentUserEmail = action.payload.email;
        state.currentUserName = action.payload.name;
        state.role = action.payload.role;
        state.isEmailVerified = action.payload.isEmailVerified;
        state.isLoading = false;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.token = null;
        localStorage.removeItem("token");
      });
  },
});

export const {
  setUser,
  setToken,
  setLoading,
  setError,
  clearUser,
  initializeAuth,
} = userSlice.actions;

export default userSlice.reducer;

// React Query hook for fetching user data
export const useUserQuery = (userId: string) => {
  return useQuery<User, Error>({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      return response.json();
    },
  });
};
