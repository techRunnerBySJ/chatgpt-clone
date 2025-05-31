import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChatWindow from "./components/ChatWindow";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import Landing from "./components/Landing";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthentication = () => {
    const session = localStorage.getItem("session");
    if (!session) {
      setIsAuthenticated(false);
      return false;
    }
    const { token, expiry } = JSON.parse(session);
    if (!token || new Date() > new Date(expiry)) {
      localStorage.removeItem("session");
      setIsAuthenticated(false);
      return false;
    }
    setIsAuthenticated(true);
    return true;
  };

  // Add logout handler to pass down
  const handleLogout = () => {
    localStorage.removeItem("session");
    setIsAuthenticated(false);
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/chat" />
              ) : (
                <Login onLogin={checkAuthentication} />
              )
            }
          />
          <Route
            path="/signup"
            element={
              isAuthenticated ? (
                <Navigate to="/chat" />
              ) : (
                <Signup onSignup={checkAuthentication} />
              )
            }
          />
          <Route
            path="/chat"
            element={
              isAuthenticated ? (
                <ChatWindow onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;