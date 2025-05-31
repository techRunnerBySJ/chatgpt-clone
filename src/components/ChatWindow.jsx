import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import useChatStore from "../stores/chatStore.js";
import useChatAPI from "../hooks/useChatAPI.js";

// ...existing code...

function ChatWindow({ onLogout }) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const uploadDropdownRef = useRef(null);
  const [showLogoutDropdown, setShowLogoutDropdown] = useState(false);
  const [showUploadDropdown, setShowUploadDropdown] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    chatSessions,
    activeSessionId,
    setActiveSessionId,
    addNewChat,
    addMessageToActiveChat,
    syncWithLocalStorage,
  } = useChatStore();

  const { sendMessage, isTyping } = useChatAPI(addMessageToActiveChat);

  const activeSession = chatSessions.find(
    (session) => session.id === activeSessionId
  );

  useEffect(() => {
    syncWithLocalStorage();
  }, [syncWithLocalStorage]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowLogoutDropdown(false);
      }
      if (
        uploadDropdownRef.current &&
        !uploadDropdownRef.current.contains(e.target)
      ) {
        setShowUploadDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate("/login", { replace: true });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex font-sans">
      {/* Sidebar */}
      <div className="w-72 bg-gray-900 border-r border-gray-800 h-screen flex flex-col sticky top-0 shadow-lg">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-cyan-300 tracking-wide">Chats</h2>
          <button
            onClick={addNewChat}
            className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition text-sm shadow-md"
          >
            New
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chatSessions.map((session) => (
            <div
              key={session.id}
              onClick={() => setActiveSessionId(session.id)}
              className={`p-3 cursor-pointer rounded-lg shadow-sm ${
                session.id === activeSessionId
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                  : "bg-gray-800 text-gray-300"
              } hover:bg-gradient-to-r hover:from-cyan-600 hover:to-blue-700 transition mb-2`}
            >
              {session.name}
            </div>
          ))}
        </div>
      </div>
  
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header with Profile Dropdown */}
        <div className="p-5 bg-black/40 backdrop-blur-md border-b border-cyan-800/20 sticky top-0 z-10 flex justify-between items-center shadow-md">
          <h1 className="text-2xl font-bold text-cyan-300 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)] tracking-wide">
            Welcome to ChaiBot
          </h1>
  
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowLogoutDropdown((prev) => !prev)}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center hover:opacity-90 shadow-lg"
            >
              <span className="text-white font-semibold">U</span>
            </button>
            {showLogoutDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-md shadow-lg ring-1 ring-cyan-700/40 z-50">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
  
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-950">
          {activeSession?.messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl shadow-lg max-w-xl ${
                msg.sender === "user"
                  ? "ml-auto bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-right"
                  : "mr-auto bg-gradient-to-br from-gray-800 to-gray-700 text-gray-100 text-left"
              }`}
            >
              {msg.text && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(msg.text),
                  }}
                />
              )}
              {msg.image && (
                <img
                  src={msg.image}
                  alt="Uploaded"
                  className="w-48 h-auto rounded-lg border border-gray-700 mt-2 shadow-md"
                />
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-2 items-center ml-4 text-gray-400 animate-pulse">
              <span className="w-2 h-2 bg-gray-400 rounded-full" />
              <span className="w-2 h-2 bg-gray-400 rounded-full" />
              <span className="w-2 h-2 bg-gray-400 rounded-full" />
            </div>
          )}
        </div>
  
        {/* Input Area */}
        <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 border-t border-gray-700 flex items-center gap-4 sticky bottom-0 shadow-lg">
          <div className="flex items-center flex-1 bg-gray-700 rounded-lg border border-gray-600 relative shadow-sm">
            <input
              type="text"
              placeholder="Type your message..."
              className={`flex-1 p-3 rounded-l-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                imagePreview ? "pl-16" : "pl-4"
              }`}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  sendMessage(e.target.value.trim());
                  e.target.value = "";
                }
              }}
            />
            {imagePreview && (
              <div className="absolute top-1/2 left-3 transform -translate-y-1/2 flex items-center gap-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-8 h-8 rounded-lg border border-gray-600 shadow-sm"
                />
                <button
                  onClick={() => setImagePreview(null)}
                  className="text-red-400 hover:text-red-500 text-sm"
                >
                  ✕
                </button>
              </div>
            )}
            <div className="relative" ref={uploadDropdownRef}>
              <button
                onClick={() => setShowUploadDropdown((prev) => !prev)}
                className="mr-2 w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center hover:from-cyan-600 hover:to-blue-600 cursor-pointer shadow-md"
              >
                <span className="text-white text-lg font-bold">+</span>
              </button>
              {showUploadDropdown && (
                <div className="absolute bottom-full mb-2 w-40 bg-gray-800 rounded-md shadow-lg ring-1 ring-cyan-700/40 z-50">
                  <label
                    htmlFor="imageUpload"
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-cyan-300 transition cursor-pointer"
                  >
                    Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      handleImageUpload(e);
                      setShowUploadDropdown(false);
                    }}
                    className="hidden"
                    id="imageUpload"
                  />
                </div>
              )}
            </div>
          </div>
          <button
            onClick={async () => {
              const input = document.querySelector('input[type="text"]');
              const text = input.value.trim();
  
              if (!text && !imageFile) return;
  
              setLoading(true);
              try {
                await sendMessage({ text, imageFile, imagePreview });
              } catch (error) {
                console.error("Error sending message:", error);
              } finally {
                setLoading(false);
                setImageFile(null);
                setImagePreview(null);
                input.value = "";
              }
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition shadow-md"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;


