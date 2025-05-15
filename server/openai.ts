import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "sk-dummy-key-for-development"
});

// System prompt for pregnancy assistant
const SYSTEM_PROMPT = `You are a helpful pregnancy assistant for expectant mothers. 
Provide accurate, factual information about pregnancy, but always remind users that 
you are not a substitute for professional medical advice. Keep responses concise, 
supportive, and informative. If a user asks something outside the scope of pregnancy, 
gently steer the conversation back to pregnancy-related topics. Always provide a disclaimer
when discussing medical topics.`;

export async function getAIResponse(
  messages: Array<{ role: string; content: string }>,
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Error getting AI response:", error);
    return "I apologize, but I'm having trouble connecting to my knowledge base right now. Please try again in a moment.";
  }
}

export async function generateTitle(messageContent: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
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
    });

    return response.choices[0].message.content?.replace(/^"(.+)"$/, '$1') || "New Conversation";
  } catch (error) {
    console.error("Error generating title:", error);
    return "New Conversation";
  }
}
