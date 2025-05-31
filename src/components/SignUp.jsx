import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate, Link } from "react-router-dom";

function Signup({ onSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    setError("");
    setSuccess("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = userCredential.user.accessToken;

      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 3);
      localStorage.setItem(
        "session",
        JSON.stringify({ token, expiry: expiry.toISOString() })
      );

      setSuccess("Signup successful! Redirecting...");
      onSignup();
      setTimeout(() => navigate("/chat"), 1500);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message || "An error occurred. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 to-black text-white px-4">
      <div className="w-full max-w-md p-8 bg-black/50 backdrop-blur-lg border border-cyan-500/20 rounded-2xl card-glow">
        <h2 className="text-3xl font-bold text-cyan-400 text-center mb-6 text-glow">Create an Account</h2>
        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
        {success && <p className="text-green-400 mb-4 text-center">{success}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 bg-black/40 text-white rounded-lg border border-cyan-500/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 placeholder-gray-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 bg-black/40 text-white rounded-lg border border-cyan-500/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 placeholder-gray-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleSignup}
          className="w-full p-3 rounded-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:opacity-90 text-white font-semibold tracking-wide focus:outline-none focus:ring-2 focus:ring-cyan-300"
        >
          Signup
        </button>
        <p className="text-gray-400 mt-6 text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-400 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
