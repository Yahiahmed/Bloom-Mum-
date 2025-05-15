// Local fallback for AI responses to ensure fast response times

// System prompt for pregnancy assistant
const SYSTEM_PROMPT = `You are a helpful pregnancy assistant for expectant mothers. 
Provide accurate, factual information about pregnancy, but always remind users that 
you are not a substitute for professional medical advice. Keep responses concise, 
supportive, and informative. If a user asks something outside the scope of pregnancy, 
gently steer the conversation back to pregnancy-related topics. Always provide a disclaimer
when discussing medical topics.`;

// Common pregnancy-related responses
const PREGNANCY_RESPONSES: { [key: string]: string } = {
  default: "I'm here to provide information about pregnancy. However, please remember that I'm not a substitute for professional medical advice. Always consult with your healthcare provider for personalized guidance.",
  
  nutrition: "Proper nutrition during pregnancy is essential. Focus on a balanced diet with plenty of fruits, vegetables, whole grains, lean proteins, and healthy fats. Key nutrients include folic acid, iron, calcium, and omega-3 fatty acids. Remember, this is general advice - consult your healthcare provider for personalized nutritional guidance.",
  
  symptoms: "Common pregnancy symptoms include morning sickness, fatigue, breast tenderness, frequent urination, and mood swings. Each pregnancy is unique, and symptoms vary widely among individuals. If you experience severe symptoms or are concerned, please consult with your healthcare provider for personalized medical advice.",
  
  exercise: "Moderate exercise during pregnancy is generally beneficial for most women. Activities like walking, swimming, and prenatal yoga are often recommended. Always consult with your healthcare provider before starting or continuing an exercise routine during pregnancy to ensure it's safe for your specific situation.",
  
  weight: "Healthy weight gain during pregnancy depends on your pre-pregnancy BMI. Generally, a gain of 25-35 pounds is recommended for those of normal weight, though this varies. Remember, this is general information - your healthcare provider should guide your specific weight management during pregnancy.",
  
  medication: "Many medications should be avoided during pregnancy as they can affect fetal development. Always consult with your healthcare provider before taking any medication, including over-the-counter drugs and supplements, to ensure they're safe during pregnancy. Never discontinue prescribed medications without medical guidance.",
  
  birth: "Birth preparation involves physical, emotional, and practical considerations. Consider taking childbirth education classes, creating a birth plan, and discussing pain management options with your healthcare provider. Remember that birth plans may need to be flexible depending on how your labor progresses.",
  
  trimester: "Pregnancy is divided into three trimesters, each about 13 weeks long. The first trimester (weeks 1-12) involves rapid development of embryonic structures. The second trimester (weeks 13-26) is when many women feel their best. The third trimester (weeks 27-40) involves final development and preparation for birth.",
};

// Keywords for matching responses
const KEYWORDS: { [key: string]: string[] } = {
  nutrition: ["food", "eat", "diet", "vitamin", "mineral", "nutrition", "hungry", "appetite", "craving", "vegetarian", "vegan"],
  symptoms: ["symptom", "feel", "morning sickness", "nausea", "vomit", "tired", "fatigue", "pain", "discomfort", "swelling"],
  exercise: ["exercise", "workout", "active", "activity", "walk", "swim", "yoga", "fitness", "strength", "cardio"],
  weight: ["weight", "gain", "pound", "kilogram", "fat", "obesity", "bmi", "heavy", "scale"],
  medication: ["medicine", "medication", "drug", "pill", "supplement", "prescription", "painkiller", "antibiotic", "safe"],
  birth: ["birth", "labor", "delivery", "contraction", "hospital", "midwife", "doula", "caesarean", "c-section", "epidural"],
  trimester: ["trimester", "week", "month", "first trimester", "second trimester", "third trimester", "development", "stage"],
};

/**
 * Get a local AI response based on message content
 */
export async function getAIResponse(
  messages: Array<{ role: string; content: string }>,
): Promise<string> {
  try {
    // Get the last user message
    const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
    
    if (!lastUserMessage) {
      return PREGNANCY_RESPONSES.default;
    }
    
    const query = lastUserMessage.content.toLowerCase();
    
    // Try to match the query with keywords
    for (const [category, keywords] of Object.entries(KEYWORDS)) {
      for (const keyword of keywords) {
        if (query.includes(keyword)) {
          return PREGNANCY_RESPONSES[category];
        }
      }
    }
    
    // Default response if no keywords match
    return PREGNANCY_RESPONSES.default;
  } catch (error) {
    console.error("Error getting local AI response:", error);
    return "I'm here to help with pregnancy-related questions. What would you like to know?";
  }
}

/**
 * Generate a conversation title based on the first message
 */
export async function generateTitle(messageContent: string): Promise<string> {
  try {
    const lowerContent = messageContent.toLowerCase();
    
    // Determine category of question
    for (const [category, keywords] of Object.entries(KEYWORDS)) {
      for (const keyword of keywords) {
        if (lowerContent.includes(keyword)) {
          return `${category.charAt(0).toUpperCase() + category.slice(1)} Question`;
        }
      }
    }
    
    // Default title
    return "Pregnancy Question";
  } catch (error) {
    console.error("Error generating title:", error);
    return "New Conversation";
  }
}