import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendImageToGemini, sendMessageToGemini } from '../services/geminiService';

function useChatAPI(addMessageToActiveChat) {
  const [isTyping, setIsTyping] = useState(false);
  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: async ({ text, imageFile }) => {
      if (imageFile) {
        return await sendImageToGemini(imageFile);
      } else if (text) {
        return await sendMessageToGemini(text);
      }
      throw new Error('No message content provided');
    },
    onMutate: async ({ text, imageFile, imagePreview }) => {
      // Optimistically update the UI
      const userMessage = {
        sender: 'user',
        text: text || (imageFile ? '📷 Sent an image.' : ''),
        image: imageFile ? imagePreview : null,
      };
      addMessageToActiveChat(userMessage);
      setIsTyping(true);
    },
    onSuccess: (data) => {
      const botMessage = {
        sender: 'bot',
        text: formatBotResponse(data)
      };
      addMessageToActiveChat(botMessage);
      // Invalidate and refetch any related queries
      queryClient.invalidateQueries({ queryKey: ['chat'] });
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      addMessageToActiveChat({
        sender: 'bot',
        text: 'An error occurred. Please try again later.',
      });
    },
    onSettled: () => {
      setIsTyping(false);
    },
  });

  const sendMessage = async ({ text, imageFile, imagePreview }) => {
    sendMessageMutation.mutate({ text, imageFile, imagePreview });
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
