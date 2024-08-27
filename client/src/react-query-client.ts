// react-query-client.ts

import { QueryClient } from "@tanstack/react-query";

// Create a QueryClient instance with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // Number of retry attempts if a query fails
      staleTime: 1000 * 30, // 30 seconds before data is considered stale
      gcTime: 1000 * 60 * 5, // 5 minutes before cached data is garbage collected
      refetchOnWindowFocus: false, // Disable refetching on window focus
    },
    mutations: {
      retry: 2, // Number of retry attempts if a mutation fails
    },
  },
});

export default queryClient;
