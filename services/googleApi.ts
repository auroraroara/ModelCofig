import Constants from 'expo-constants';

const GOOGLE_API_KEY = 'AIzaSyBLCClqbU8kszpz6fh5fdPQwou80dW2Mbs';
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

interface GenerateContentResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export const googleApi = {
  async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${BASE_URL}/models/gemini-2.0-flash:generateContent?key=${GOOGLE_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate response');
      }

      const data: GenerateContentResponse = await response.json();
      return data.candidates[0]?.content.parts[0]?.text || 'Sorry, I could not generate a response.';
    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
  },
};