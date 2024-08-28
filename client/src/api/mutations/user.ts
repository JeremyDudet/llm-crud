// src/api/mutations/user.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../apiClient";

interface CreateUserData {
  name: string;
  email: string;
  // Add other properties needed for user creation
}

interface UpdateUserData {
  id: number;
  name?: string;
  email?: string;
  // Add other properties that can be updated
}

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, CreateUserData>(
    async (userData) => {
      const { data } = await apiClient.post<User>("/users", userData);
      return data;
    },
    {
      onSuccess: () => {
        // Invalidate and refetch users list
        queryClient.invalidateQueries(["users"]);
      },
    }
  );
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, UpdateUserData>(
    async (userData) => {
      const { data } = await apiClient.put<User>(
        `/users/${userData.id}`,
        userData
      );
      return data;
    },
    {
      onSuccess: (data) => {
        // Update the user in the cache
        queryClient.setQueryData(["user", data.id], data);
        // Invalidate and refetch users list
        queryClient.invalidateQueries(["users"]);
      },
    }
  );
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>(
    async (userId) => {
      await apiClient.delete(`/users/${userId}`);
    },
    {
      onSuccess: (_, userId) => {
        // Remove the user from the cache
        queryClient.removeQueries(["user", userId]);
        // Invalidate and refetch users list
        queryClient.invalidateQueries(["users"]);
      },
    }
  );
};
