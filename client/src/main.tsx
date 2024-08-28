// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
// Import your css
import "./styles/index.css";
// Import your store
import { store } from "./redux/store";
import { Provider as StoreProvider } from "react-redux";
// Import your query client
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// Import your pages/routes
import AppRouter from "./routes/AppRouter";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StoreProvider>
  </React.StrictMode>
);
