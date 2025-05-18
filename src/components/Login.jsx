import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate, Link } from "react-router-dom";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Success message state
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success messages
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = userCredential.user.accessToken;

      // Set session with 3-day expiration
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 3);
      localStorage.setItem(
        "session",
        JSON.stringify({ token, expiry: expiry.toISOString() })
      );

      setSuccess("Logged in successfully! Redirecting...");
      onLogin(); // Update authentication state in App.jsx
      setTimeout(() => navigate("/"), 1500); // Redirect to ChatWindow after 1.5 seconds
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message || "An error occurred. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-lg font-semibold text-orange-300 mb-4">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full p-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
        >
          Login
        </button>
        <p className="text-gray-400 mt-4 text-sm">
          Not registered?{" "}
          <Link to="/signup" className="text-orange-500 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;