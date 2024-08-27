import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import apiClient from "../api/apiClient";

// Assuming you have a type for your items
interface Item {
  id: number;
  name: string;
  // Add other properties as needed
}

const queryClient = new QueryClient();

export function useItems() {
  return useQuery<Item[], Error>({
    queryKey: ["items"],
    queryFn: async () => {
      const { data } = await apiClient.get<Item[]>("/items");
      return data;
    },
  });
}

export function useCreateItem() {
  return useMutation<Item, Error, Omit<Item, "id">>({
    mutationFn: async (newItem) => {
      const { data } = await apiClient.post<Item>("/items", newItem);
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}

// Add more hooks for other CRUD operations as needed
