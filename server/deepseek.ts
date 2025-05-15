import axios from 'axios';

// Deepseek API client implementation
// Note: Using generic LLM API structure, update this with the correct Deepseek API endpoint when available
const DEEPSEEK_API_URL = 'https://api.deepseek.ai/v1/chat/completions';

// System prompt for pregnancy assistant
const SYSTEM_PROMPT = `You are a helpful pregnancy assistant for expectant mothers. 
Provide accurate, factual information about pregnancy, but always remind users that 
you are not a substitute for professional medical advice. Keep responses concise, 
supportive, and informative. If a user asks something outside the scope of pregnancy, 
gently steer the conversation back to pregnancy-related topics. Always provide a disclaimer
when discussing medical topics.`;

interface DeepseekMessage {
  role: string;
  content: string;
}

interface DeepseekRequest {
  model: string;
  messages: DeepseekMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export async function getAIResponse(
  messages: Array<{ role: string; content: string }>,
): Promise<string> {
  try {
    // Check if API key exists
    if (!process.env.DEEPSEEK_API_KEY) {
      console.error("Deepseek API key is missing");
      return "I apologize, but I'm having trouble connecting to my knowledge base right now. Please ensure the Deepseek API key is properly configured.";
    }

    const requestData: DeepseekRequest = {
      model: "deepseek-chat", // Using generic model name, replace with actual Deepseek model
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 500,
    };
    
    console.log("Sending request to Deepseek:", JSON.stringify(requestData, null, 2));

    const response = await axios.post(DEEPSEEK_API_URL, requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      }
    });

    return response.data.choices[0].message.content || 
      "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Error getting AI response from Deepseek:", error);
    
    if (axios.isAxiosError(error)) {
      console.error("Deepseek API error details:", error.response?.data);
    }
    
    return "I apologize, but I'm having trouble connecting to my knowledge base right now. Please try again in a moment.";
  }
}

export async function generateTitle(messageContent: string): Promise<string> {
  try {
    // Check if API key exists
    if (!process.env.DEEPSEEK_API_KEY) {
      console.error("Deepseek API key is missing");
      return "New Conversation";
    }

    const requestData: DeepseekRequest = {
      model: "deepseek-chat", // Replace with actual model name from Deepseek
      messages: [
        {
          role: "system",
          content: "Generate a short, concise title (3-5 words) for this conversation based on the first message. Do not use quotes."
        },
        {
          role: "user",
          content: messageContent
        }
      ],
      temperature: 0.7,
      max_tokens: 20,
    };

    const response = await axios.post(DEEPSEEK_API_URL, requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      }
    });

    return response.data.choices[0].message.content?.replace(/^"(.+)"$/, '$1') || "New Conversation";
  } catch (error) {
    console.error("Error generating title with Deepseek:", error);
    
    if (axios.isAxiosError(error)) {
      console.error("Deepseek API error details:", error.response?.data);
    }
    
    return "New Conversation";
  }
}