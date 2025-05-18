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
  
  export const sendImageToGemini = async (imageFile) => {
    const API_KEY = 'AIzaSyCBsOxCxvZgWgQqGm1_2UIO-krjTFWLaS4';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
  
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = async () => {
        const base64Image = reader.result.split(',')[1]; // Remove data:image/... prefix
        
        const requestData = {
          contents: [
            {
              parts: [
                { text: "What is in this image?" },
                {
                  inline_data: {
                    mime_type: imageFile.type,
                    data: base64Image,
                  },
                },
              ],
            },
          ],
        };
  
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
          });
  
          const data = await response.json();
          if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            resolve(data.candidates[0].content.parts[0].text);
          } else {
            reject('No valid response');
          }
        } catch (err) {
          console.error('Error from Gemini API:', err);
          reject('Error contacting Gemini');
        }
      };
  
      reader.onerror = () => reject('Failed to read image file');
      reader.readAsDataURL(imageFile); // This gives base64-encoded image
    });
  };
  