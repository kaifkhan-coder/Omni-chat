import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// Singleton to hold the chat instance
let chatSession: Chat | null = null;

const getClient = (): GoogleGenAI => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not defined in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const initializeChat = (): Chat => {
  const ai = getClient();
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: "You are OmniChat, a helpful, witty, and highly intelligent AI assistant. You answer questions concisely but comprehensively. You use Markdown for formatting when appropriate.",
    },
  });
  return chatSession;
};

export const getChatSession = (): Chat => {
  if (!chatSession) {
    return initializeChat();
  }
  return chatSession;
};

export const sendMessageStream = async (
  message: string,
  onChunk: (text: string) => void
): Promise<void> => {
  const chat = getChatSession();
  
  try {
    const resultStream = await chat.sendMessageStream({ message });
    
    for await (const chunk of resultStream) {
      const c = chunk as GenerateContentResponse;
      if (c.text) {
        onChunk(c.text);
      }
    }
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};