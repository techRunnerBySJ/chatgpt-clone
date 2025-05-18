import { useState } from 'react';
import { sendMessageToGemini } from '../services/geminiService';

function useChatAPI(addMessageToActiveChat) {
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (text) => {
    const userMessage = { sender: 'user', text };
    addMessageToActiveChat(userMessage);

    setIsTyping(true);

    try {
      const data = await sendMessageToGemini(text);
      const botMessage = data
        ? { sender: 'bot', text: formatBotResponse(data) }
        : { sender: 'bot', text: 'Sorry, something went wrong. Please try again later.' };

      addMessageToActiveChat(botMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      addMessageToActiveChat({
        sender: 'bot',
        text: 'An error occurred. Please try again later.',
      });
    } finally {
      setIsTyping(false);
    }
  };

  const formatBotResponse = (response) => {
    const lines = response.split('\n');
    const rawHTML = lines
      .map((line) => {
        if (line.startsWith('# ')) {
          return `<h3 class="font-bold text-lg">${line.slice(2)}</h3>`;
        } else if (line.startsWith('- ')) {
          return `<li class="list-disc ml-5">${line.slice(2)}</li>`;
        } else {
          let formattedLine = line
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
          return `<p class="text-sm">${formattedLine}</p>`;
        }
      })
      .join('');
    return rawHTML;
  };

  return { sendMessage, isTyping };
}

export default useChatAPI;