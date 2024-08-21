// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { selectAuth } from "./features/auth/authSlice";

// Import your components
import Layout from "./components/AppShell";
import Home from "./pages/index";
import Login from "./pages/Login/index";
import Dashboard from "./pages/Dashboard/index";
import Profile from "./pages/Profile/index";
import NotFound from "./pages/NotFound/index";
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public routes */}
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};

// ProtectedRoute component
const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAppSelector(selectAuth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <React.Fragment />;
};

export default App;
