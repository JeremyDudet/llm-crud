// routes/AppRouter.tsx
// Function: Define main routing configuration.
// Expected Output: Router component with route definitions.

import LandingPage from "../pages/LandingPage/index";
import Login from "../pages/Login/index";
import Profile from "../pages/Profile/index";
import NotFound from "../pages/NotFound/index";
import CreateAccount from "../pages/CreateAccount/index";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../pages/Dashboard/index";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
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
