// src/api/mutations/user.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../apiClient";

interface User {
  id: number;
  name: string;
  email: string;
  // Add other properties as needed
}

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

  return useMutation<User, Error, CreateUserData>({
    mutationFn: async (userData) => {
      const { data } = await apiClient.post<User>("/users", userData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, UpdateUserData>({
    mutationFn: async (userData) => {
      const { data } = await apiClient.put<User>(
        `/users/${userData.id}`,
        userData
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["user", data.id], data);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (userId) => {
      await apiClient.delete(`/users/${userId}`);
    },
    onSuccess: (_, userId) => {
      queryClient.removeQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
