import React from "react";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a23] via-[#111132] to-black relative overflow-hidden">
      {/* Blue glow at the top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-cyan-500/30 blur-3xl rounded-full pointer-events-none" />
      <div className="flex flex-col items-center z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 text-center drop-shadow-lg">What do you want to build?</h1>
        <p className="text-lg text-gray-300 mb-8 text-center">Prompt, run, edit, and deploy full-stack <span className="font-bold text-white">web</span> and <span className="font-bold text-white">mobile</span> apps.</p>
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:opacity-90 text-white font-semibold text-lg shadow-lg transition"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 hover:opacity-90 text-white font-semibold text-lg shadow-lg transition"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Landing; 