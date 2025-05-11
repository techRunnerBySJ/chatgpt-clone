export const sendMessageToGemini = async (userInput) => {
    const API_KEY = 'AIzaSyCBsOxCxvZgWgQqGm1_2UIO-krjTFWLaS4';  // Replace this with your actual API Key
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
  
    const requestData = {
      contents: [
        {
          parts: [{ text: userInput }]
        }
      ]
    };
  
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
  
      const data = await response.json();
  
      // Check for valid response from API and extract the content text
      if (data && data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text; // Extract the text part from the response
      } else {
        throw new Error('No valid response from Gemini API');
      }
    } catch (error) {
      console.error('Error fetching response from Gemini API:', error);
      return 'Sorry, something went wrong. Please try again later.';
    }
  };
  