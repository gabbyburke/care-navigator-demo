// Cloud Function service to interact with Google Cloud Functions for AI processing

// Base URLs for the Cloud Functions
// These URLs come from the .env file or environment variables in your hosting platform
const ANALYZE_SITUATION_URL = import.meta.env.VITE_ANALYZE_SITUATION_URL || 'https://us-central1-your-project-id.cloudfunctions.net/analyze-situation';
const GENERATE_RESPONSE_URL = import.meta.env.VITE_GENERATE_RESPONSE_URL || 'https://us-central1-your-project-id.cloudfunctions.net/generate-response';

// Interface for program data
interface Program {
  id: number;
  name: string;
  description: string;
  eligibility: string;
}

// Cloud Function service
export const cloudFunctionService = {
  /**
   * Analyzes the user's situation using the analyze-situation Cloud Function
   * @param situation The user's description of their situation
   * @returns Promise with the recommended programs
   */
  analyzeUserSituation: async (situation: string): Promise<{
    programs: Program[];
  }> => {
    try {
      // For development/testing, use the mock service if the URL is not set
      if (ANALYZE_SITUATION_URL.includes('your-project-id')) {
        console.warn('Using mock AI service - Cloud Function URL not configured');
        return import('./mockAI').then(module => {
          return module.mockAIService.analyzeUserSituation(situation);
        });
      }

      const response = await fetch(ANALYZE_SITUATION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ situation }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze situation');
      }

      return await response.json();
    } catch (error) {
      console.error('Error analyzing situation:', error);
      
      // Fallback to mock service in case of error
      return import('./mockAI').then(module => {
        console.warn('Falling back to mock AI service due to error');
        return module.mockAIService.analyzeUserSituation(situation);
      });
    }
  },

  /**
   * Generates a response to a user's question using the generate-response Cloud Function
   * @param question The user's question
   * @param programs Optional array of programs for context
   * @param chatHistory Optional chat history (not used with the direct generation approach)
   * @returns Promise with the generated response
   */
  generateResponse: async (question: string, programs?: Program[], chatHistory?: Array<{type: 'user' | 'ai', message: string}>): Promise<string> => {
    try {
      // For development/testing, use the mock service if the URL is not set
      if (GENERATE_RESPONSE_URL.includes('your-project-id')) {
        console.warn('Using mock AI service - Cloud Function URL not configured');
        return import('./mockAI').then(module => {
          return module.mockAIService.generateResponse(question);
        });
      }

      // Direct generation approach - just send the question and programs
      console.log('Sending request to Cloud Function:', {
        question,
        programsCount: programs?.length || 0
      });

      const response = await fetch(GENERATE_RESPONSE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          question,
          programs: programs || []
          // No history parameter - using direct generation approach
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate response');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error generating response:', error);
      
      // Fallback to mock service in case of error
      return import('./mockAI').then(module => {
        console.warn('Falling back to mock AI service due to error');
        return module.mockAIService.generateResponse(question);
      });
    }
  }
};
