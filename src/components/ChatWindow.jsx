import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import useChatStore from '../stores/chatStore.js';
import useChatAPI from '../hooks/useChatAPI.js';

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

  useEffect(() => {
    syncWithLocalStorage();
  }, [syncWithLocalStorage]);

  // Logout function
  const handleLogout = () => {
    onLogout(); // Update auth state in App
    navigate("/login", { replace: true });
  };

  const activeSession = chatSessions.find((session) => session.id === activeSessionId);

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
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-700 text-gray-300'
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
        <div className="p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center sticky top-0">
          <h1 className="text-2xl font-bold text-orange-300">ChatGPT Clone</h1>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
          {activeSession?.messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-orange-600 text-white ml-auto text-right max-w-sm'
                  : 'bg-gray-700 text-white mr-auto text-left max-w-xl'
              }`}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(msg.text) }}
            />
          ))}
          {isTyping && <div className="italic text-gray-400">Bot is typing...</div>}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gray-800 border-t border-gray-700 flex items-center gap-4 sticky bottom-0">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                sendMessage(e.target.value.trim());
                e.target.value = '';
              }
            }}
          />
          <button
            onClick={() => {
              const input = document.querySelector('input');
              if (input.value.trim()) {
                sendMessage(input.value.trim());
                input.value = '';
              }
            }}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;