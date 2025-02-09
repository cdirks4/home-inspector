import { grokService } from "./grokIntegration";

interface InspectionData {
  propertyType: string;
  squareFootage: number;
  yearBuilt: number;
  lastInspectionDate?: string;
}

export const getDeFiAssistant = async (userId?: string) => {
  console.log("🏠 Initializing Home Inspector Assistant...");

  const assistant = {
    name: "Home Inspector Assistant",
    firstMessage: "Hello! I'm your home inspection assistant. I can help you understand the inspection process, schedule an inspection, or answer questions about common home issues. How can I assist you today?",
    transcriber: {
      provider: "deepgram",
      model: "nova-2",
      language: "en-US",
    },
    voice: {
      provider: "cartesia",
      voiceId: "565510e8-6b45-45de-8758-13588fbaec73",
    },
    analysisPlan: {
      structuredDataPrompt: `Home Inspection Assistant powered by AI.
      
      Available actions:
      - Property condition assessment
      - Inspection scheduling
      - Common issues explanation
      - Maintenance recommendations
      
      Current status: Ready to assist
      `,
    },
    processUserInput: async (userInput: string) => {
      return grokService.processPrompt(userInput);
    },
    onError: (error: any) => {
      console.error("Assistant error:", error);
    }
  };

  console.log("✨ Home Inspector Assistant initialized successfully");
  return assistant;
};
