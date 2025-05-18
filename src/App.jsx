import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ChatWindow from "./components/ChatWindow";
import Login from "./components/Login";
import Signup from "./components/SignUp";

function App() {
  const isAuthenticated = () => {
    const session = localStorage.getItem("session");
    if (!session) return false;

    const { token, expiry } = JSON.parse(session);
    if (!token || new Date() > new Date(expiry)) {
      localStorage.removeItem("session");
      return false;
    }
    return true;
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated() ? <ChatWindow /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={isAuthenticated() ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated() ? <Navigate to="/" /> : <Signup />}
        />
      </Routes>
    </Router>
  );
}

export default App;