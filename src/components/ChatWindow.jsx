import React, { useState, useEffect } from 'react';
import { sendMessageToGemini } from '../services/geminiService';
function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false); // State for "typing..." loader

  // Load chat history from localStorage when the component mounts
  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem('chatHistory'));
    if (savedMessages) {
      setMessages(savedMessages);
    }
  }, []);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  const handleSend = async (text) => {
    // Show user message
    const userMessage = { sender: 'user', text };
    setMessages([...messages, userMessage]);

    // Show "typing..." loader
    setIsTyping(true);

    // Fetch bot response from Google Gemini
    const data = await sendMessageToGemini(text);

    // Hide "typing..." loader
    setIsTyping(false);

    // If the response contains valid text, show bot message
    if (data) {
      const botMessage = {
        sender: 'bot',
        text: formatBotResponse(data), // Format the bot's response
      };
      setMessages((prev) => [...prev, botMessage]);
    } else {
      const errorMessage = { sender: 'bot', text: 'Sorry, something went wrong. Please try again later.' };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  // Function to format the bot's response dynamically
  const formatBotResponse = (response) => {
    const lines = response.split('\n');
    return lines
      .map((line) => {
        if (line.startsWith('# ')) {
          return `<h3>${line.slice(2)}</h3>`; // Convert lines starting with "# " to <h3>
        } else if (line.startsWith('- ')) {
          return `<li>${line.slice(2)}</li>`; // Convert lines starting with "- " to <li>
        } else {
          return `<p>${line}</p>`; // Default to <p> for other lines
        }
      })
      .join('');
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.sender}`}
            dangerouslySetInnerHTML={{ __html: msg.text }} // Render structured HTML
          />
        ))}
        {isTyping && <div className="typing-indicator">Bot is typing...</div>} {/* Show typing indicator */}
      </div>
      <div className="input-box">
        <input
          type="text"
          placeholder="Type your message..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
              handleSend(e.target.value.trim());
              e.target.value = '';
            }
          }}
        />
        <button
          onClick={() => {
            const input = document.querySelector('.input-box input');
            if (input.value.trim()) {
              handleSend(input.value.trim());
              input.value = '';
            }
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;