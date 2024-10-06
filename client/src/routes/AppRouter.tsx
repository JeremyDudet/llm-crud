// routes/AppRouter.tsx
// Function: Define main routing configuration.
// Expected Output: Router component with route definitions.
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import CreateAccount from "../pages/CreateAccount";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../pages/Dashboard";
import Library from "../pages/Library";
import Analytics from "../pages/Analytics";
import ForgotPassword from "../pages/ForgotPassword";
import ChatThread from "@/pages/ChatThread";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <NotFound />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <NotFound />,
  },
  {
    path: "/create-account",
    element: <CreateAccount />,
    errorElement: <NotFound />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    errorElement: <NotFound />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/chat/:threadId",
    element: (
      <PrivateRoute>
        <ChatThread />
      </PrivateRoute>
    ),
  },
  {
    path: "/library",
    element: (
      <PrivateRoute>
        <Library />
      </PrivateRoute>
    ),
  },
  {
    path: "/analytics",
    element: (
      <PrivateRoute>
        <Analytics />
      </PrivateRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    ),
    errorElement: <NotFound />,
  },
]);

const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
