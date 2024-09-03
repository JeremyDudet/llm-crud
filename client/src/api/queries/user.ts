// src/api/queries/user.ts
import { useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient";

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await apiClient.get("/users");
      return response.data;
    },
  });
};

export const useGetUser = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    },
  });
};
