// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
// Import your css
import "./styles/index.css";
// Import your store
import { store } from "./store";
import { Provider as StoreProvider } from "react-redux";
// Import your query client
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./react-query-client";
// Import your pages/routes
import AppRouter from "./routes/AppRouter";
import { fetchUserData, setToken } from "./features/user/userSlice";

// Initialize auth and fetch user data if a token exists
const token = localStorage.getItem("token");
if (token) {
  store.dispatch(setToken(token));
  store.dispatch(fetchUserData());
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
      </QueryClientProvider>
    </StoreProvider>
  </React.StrictMode>
);
