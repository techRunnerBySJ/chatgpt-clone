import { sendMessageToGemini, sendImageToGemini } from './geminiService';

export const sendChatMessage = async ({ text, imageFile }) => {
  try {
    let response;
    
    if (imageFile) {
      response = await sendImageToGemini(imageFile);
    } else if (text) {
      response = await sendMessageToGemini(text);
    }

    return {
      response: formatBotResponse(response),
      success: true
    };
  } catch (error) {
    console.error('Error in chat service:', error);
    throw new Error('Failed to process message');
  }
};

const formatBotResponse = (response) => {
  if (!response) return 'Sorry, something went wrong. Please try again later.';
  
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