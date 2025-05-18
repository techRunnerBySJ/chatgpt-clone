import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import useChatStore from "../stores/chatStore.js";
import useChatAPI from "../hooks/useChatAPI.js";

function ChatWindow({ onLogout }) {
  const navigate = useNavigate();
  const {
    chatSessions,
    activeSessionId,
    setActiveSessionId,
    addNewChat,
    addMessageToActiveChat,
    syncWithLocalStorage,
  } = useChatStore();

  const { sendMessage, isTyping } = useChatAPI(addMessageToActiveChat);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    syncWithLocalStorage();
  }, [syncWithLocalStorage]);

  // Logout function
  const handleLogout = () => {
    onLogout(); // Update auth state in App
    navigate("/login", { replace: true });
  };

  const activeSession = chatSessions.find(
    (session) => session.id === activeSessionId
  );

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidenav */}
      <div className="w-72 bg-gray-800 border-r border-gray-600 h-screen flex flex-col sticky top-0">
        <div className="p-4 border-b border-gray-600 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-orange-300">Chats</h2>
          <button
            onClick={addNewChat}
            className="px-3 py-1 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm"
          >
            New
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chatSessions.map((session) => (
            <div
              key={session.id}
              onClick={() => setActiveSessionId(session.id)}
              className={`p-3 cursor-pointer ${
                session.id === activeSessionId
                  ? "bg-orange-600 text-white"
                  : "bg-gray-700 text-gray-300"
              } hover:bg-orange-500 transition border-b border-gray-600`}
            >
              {session.name}
            </div>
          ))}
        </div>
        <button
          onClick={handleLogout}
          className="p-3 bg-red-600 text-white hover:bg-red-700 transition mt-4"
        >
          Logout
        </button>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-purple-800 via-indigo-600 to-blue-500 border-b border-gray-700 flex justify-between items-center sticky top-0">
          <h1 className="text-2xl font-bold text-white">Chai Bot</h1>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
          {activeSession?.messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg shadow-md ${
                msg.sender === "user"
                  ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white ml-auto text-right max-w-sm"
                  : "bg-gradient-to-r from-gray-700 to-gray-800 text-white mr-auto text-left max-w-xl"
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
                  alt="Uploaded by user"
                  className="w-48 h-auto rounded-lg border border-gray-700 shadow-md mt-2"
                />
              )}
            </div>
          ))}
          {isTyping && (
            <div className="typing-loader">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 border-t border-gray-700 flex items-center gap-4 sticky bottom-0">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value.trim()) {
                sendMessage(e.target.value.trim());
                e.target.value = "";
              }
            }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="imageUpload"
          />
          <label
            htmlFor="imageUpload"
            className="block w-full cursor-pointer px-4 py-2 text-center text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-md hover:from-blue-600 hover:to-purple-600"
          >
            Upload an Image
          </label>

          {imagePreview && (
            <div className="flex flex-col items-start gap-2 mt-4">
              <p className="text-sm text-gray-400">
                🖼️ You uploaded this image:
              </p>
              <img
                src={imagePreview}
                alt="Uploaded Preview"
                className="w-48 h-auto rounded-lg border border-gray-700 shadow-md"
              />
            </div>
          )}

          {/* Conditional rendering for loading message */}
          {loading && imageFile && (
            <div className="mt-2 text-sm text-blue-400 animate-pulse">
              🔍 Analyzing image...
            </div>
          )}

          <button
            onClick={async () => {
              const input = document.querySelector('input[type="text"]');
              const text = input.value.trim();

              if (!text && !imageFile) return; // Nothing to send

              setLoading(true);
              try {
                await sendMessage({ text, imageFile, imagePreview }); // Pass both text and image
              } catch (error) {
                console.error("Error sending message:", error);
              } finally {
                setLoading(false);
                setImageFile(null);
                setImagePreview(null);
                input.value = ""; // Clear the input field
              }
            }}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
