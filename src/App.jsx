import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Placeholder for other pages
const EmptyPage = ({ title }) => (
  <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
      {title} Page
    </h1>
    <p className="text-gray-500 dark:text-gray-400 mt-2">Coming soon...</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="monthly" element={<EmptyPage title="Monthly" />} />
            <Route
              path="categories"
              element={<EmptyPage title="Categories" />}
            />
            <Route path="settings" element={<EmptyPage title="Settings" />} />
          </Route>

          {/* Catch all redirect to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
