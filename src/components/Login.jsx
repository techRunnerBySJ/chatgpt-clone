import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate, Link } from "react-router-dom";

function Login() {
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
      setTimeout(() => navigate("/"), 1500); // Redirect to ChatWindow after 1.5 seconds
    } catch (error) {
        console.error("Login error:", error);
      
        const errorCode = error.code;
        const errorMessage = error.message;
      
        if (errorCode === "auth/user-not-found") {
          setError("No user found with this email. Please create a new account.");
        } else if (
          errorCode === "auth/wrong-password" ||
          errorCode === "auth/invalid-login-credentials" ||
          errorCode === "auth/invalid-credential" ||
          errorCode === "auth/invalid-email" ||
          errorCode === "auth/invalid-password"
        ) {
          setError("Invalid login credentials. Please try again.");
        } else if (errorCode === "auth/too-many-requests") {
            setError("Too many login attempts. Please try again later.");
          }
         else {
          setError(errorMessage || "An unknown error occurred. Please try again.");
        }
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold text-orange-600 mb-4 text-center">LOGIN</h2>
        {error && <span className="text-red-500 mb-4 text-sm font-semibold">{error}</span>}
        {success && <span className="text-green-500 mb-4">{success}</span>}
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