// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
// Import your css
import "./index.css";
// Import your store
import { store } from "./store/store";
import { Provider as StoreProvider } from "react-redux";
// Import your query client
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Import your pages/routes
import Home from "./pages/index";
import Login from "./pages/Login/index";
import Profile from "./pages/Profile/index";
import NotFound from "./pages/NotFound/index";
import Library from "./pages/Library/index";
import Records from "./pages/Records/index";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFound />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <NotFound />,
  },
  {
    path: "/library",
    element: <Library />,
    errorElement: <NotFound />,
  },
  {
    path: "/records",
    element: <Records />,
    errorElement: <NotFound />,
  },
  {
    path: "/profile",
    element: <Profile />,
    errorElement: <NotFound />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StoreProvider>
  </React.StrictMode>
);
