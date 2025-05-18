import { useState } from 'react';
import { sendImageToGemini, sendMessageToGemini } from '../services/geminiService';

function useChatAPI(addMessageToActiveChat) {
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async ({ text, imageFile, imagePreview }) => {
    const isImage = !!imageFile;
    const userMessage = {
      sender: 'user',
      text: text || (isImage ? '📷 Sent an image.' : ''),
      image: isImage ? imagePreview : null,
    };
  
    addMessageToActiveChat(userMessage);
    setIsTyping(true);
  
    try {
      let data;
      if (isImage) {
        data = await sendImageToGemini(imageFile);
      } else if (text) {
        data = await sendMessageToGemini(text);
      }
  
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
    return lines
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
  };

  return { sendMessage, isTyping };
}

export default useChatAPI;
