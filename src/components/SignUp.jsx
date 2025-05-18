import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Success message state
  const navigate = useNavigate();

  const handleSignup = async () => {
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success messages
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = userCredential.user.accessToken;

      // Set session with 3-day expiration
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 3);
      localStorage.setItem(
        "session",
        JSON.stringify({ token, expiry: expiry.toISOString() })
      );

      setSuccess("Signup successful! Redirecting...");
      setTimeout(() => navigate("/"), 1500); // Redirect to ChatWindow after 1.5 seconds
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please log in.");
      } else if (error.code === "auth/weak-password") {
        setError("Password should be at least 6 characters long.");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-lg font-semibold text-orange-300 mb-4">Signup</h2>
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
          onClick={handleSignup}
          className="w-full p-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
        >
          Signup
        </button>
      </div>
    </div>
  );
}

export default Signup;