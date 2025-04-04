// Mock AI service to simulate responses until Vertex AI integration
export const mockAIService = {
  analyzeUserSituation: async (situation: string): Promise<{
    programs: Array<{
      id: number;
      name: string;
      description: string;
      eligibility: string;
    }>;
  }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock response based on keywords in the situation
    const programs = [];

    if (situation.toLowerCase().includes('housing') || situation.toLowerCase().includes('rent')) {
      programs.push({
        id: 1,
        name: 'Housing Choice Voucher Program',
        description: 'Provides assistance to very low-income families to afford decent, safe, and sanitary housing.',
        eligibility: 'Income must be below 50% of median area income'
      });
    }

    if (situation.toLowerCase().includes('food') || situation.toLowerCase().includes('meal')) {
      programs.push({
        id: 2,
        name: 'SNAP Benefits',
        description: 'Helps low-income individuals and families buy healthy food.',
        eligibility: 'Based on household size and monthly income'
      });
    }

    if (situation.toLowerCase().includes('job') || situation.toLowerCase().includes('work') || 
        situation.toLowerCase().includes('training') || situation.toLowerCase().includes('skill')) {
      programs.push({
        id: 3,
        name: 'Workforce Innovation and Opportunity Act (WIOA)',
        description: 'Provides job training and employment services to help job seekers find work.',
        eligibility: 'Priority for low-income individuals and those requiring training to obtain employment'
      });
    }

    if (situation.toLowerCase().includes('child') || situation.toLowerCase().includes('kid')) {
      programs.push({
        id: 4,
        name: 'Child Care Assistance Program',
        description: 'Helps families pay for child care while working or attending school.',
        eligibility: 'Income requirements vary by state and family size'
      });
    }

    // Always include at least one program
    if (programs.length === 0) {
      programs.push({
        id: 5,
        name: 'General Assistance Program',
        description: 'Provides temporary help to those in need while they work to improve their situation.',
        eligibility: 'Based on individual circumstances and needs assessment'
      });
    }

    return { programs };
  },

  // Mock chat response for questions about programs
  generateResponse: async (question: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple keyword-based responses
    if (question.toLowerCase().includes('eligib')) {
      return "Eligibility is typically based on factors like income, household size, and specific circumstances. I can help you understand the requirements for specific programs you're interested in.";
    }
    
    if (question.toLowerCase().includes('apply') || question.toLowerCase().includes('sign up')) {
      return "The application process varies by program. Once you select the programs you're interested in, I can provide specific steps and documentation requirements for each one.";
    }

    if (question.toLowerCase().includes('time') || question.toLowerCase().includes('long')) {
      return "Processing times vary by program and location. Most programs aim to process applications within 30 days, though some may be faster or slower depending on your circumstances and the program's current capacity.";
    }

    // Default response
    return "I can help you understand more about these programs. What specific aspects would you like to know about?";
  }
};
