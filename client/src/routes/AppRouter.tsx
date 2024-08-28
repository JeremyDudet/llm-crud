// routes/AppRouter.tsx
// Function: Define main routing configuration.
// Expected Output: Router component with route definitions.

import Home from "../pages/index";
import Login from "../pages/Login/index";
import Profile from "../pages/Profile/index";
import NotFound from "../pages/NotFound/index";
import Library from "../pages/Library/index";
import Records from "../pages/Records/index";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

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

const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
