import axios from 'axios';

// Define your API URL - in a real app, you would use a real server URL
// For now, we'll use a placeholder for local API
const API_URL = 'http://localhost:5000/api';

// Helper function to get AI response from server
export const getAIResponse = async (message) => {
  try {
    const response = await axios.post(`${API_URL}/chat`, { content: message });
    return response.data;
  } catch (error) {
    console.error('Error getting AI response:', error);
    // Fallback response when the API fails
    return {
      aiResponse: {
        content: mockGetAIResponse(message)
      }
    };
  }
};

// Helper function to get topics
export const getTopics = async () => {
  try {
    const response = await axios.get(`${API_URL}/topics`);
    return response.data;
  } catch (error) {
    console.error('Error getting topics:', error);
    return mockTopics;
  }
};

// Helper function to get resources for a specific topic
export const getResources = async (topicId) => {
  try {
    const url = topicId ? `${API_URL}/resources?topicId=${topicId}` : `${API_URL}/resources`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error getting resources:', error);
    return topicId 
      ? mockResources.filter(resource => resource.topicId === topicId)
      : mockResources;
  }
};

// Helper function to get conversations
export const getConversations = async () => {
  try {
    const response = await axios.get(`${API_URL}/conversations`);
    return response.data;
  } catch (error) {
    console.error('Error getting conversations:', error);
    return [];
  }
};

// Helper function to get messages for a conversation
export const getMessages = async (conversationId) => {
  try {
    const response = await axios.get(`${API_URL}/conversations/${conversationId}/messages`);
    return response.data;
  } catch (error) {
    console.error('Error getting messages:', error);
    return [];
  }
};

// Local fallback functions and data for offline use

// This would be replaced with actual API calls in a production app
const mockGetAIResponse = (message) => {
  const commonResponses = {
    nutrition: "During pregnancy, focus on a balanced diet rich in folate, iron, calcium, and protein. Include plenty of fruits, vegetables, whole grains, lean proteins, and dairy. Stay hydrated and take prenatal vitamins as recommended by your healthcare provider.",
    exercise: "Safe exercises during pregnancy include walking, swimming, stationary cycling, and prenatal yoga. Always consult with your healthcare provider before starting any exercise routine. Aim for 30 minutes of moderate activity most days of the week, but listen to your body and avoid overexertion.",
    symptoms: "Common pregnancy symptoms include morning sickness, fatigue, breast tenderness, frequent urination, and mood changes. Most are normal, but severe symptoms should be discussed with your healthcare provider.",
    default: "I'm your pregnancy assistant. I can provide information on nutrition, exercise, common symptoms, and preparing for birth. What specific question can I help you with today?"
  };

  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes('nutrition') || lowerMessage.includes('diet') || lowerMessage.includes('food') || lowerMessage.includes('eat'))
    return commonResponses.nutrition;
  else if (lowerMessage.includes('exercise') || lowerMessage.includes('workout') || lowerMessage.includes('activity'))
    return commonResponses.exercise;
  else if (lowerMessage.includes('symptom') || lowerMessage.includes('feel') || lowerMessage.includes('morning sickness') || lowerMessage.includes('nausea'))
    return commonResponses.symptoms;
  return commonResponses.default;
};

// Mock data for demonstration purposes when API is unavailable
const mockTopics = [
  { id: 1, title: 'First Trimester', description: 'Guidance for weeks 1-12 of pregnancy', icon: 'calendar' },
  { id: 2, title: 'Second Trimester', description: 'Information for weeks 13-26 of pregnancy', icon: 'calendar' },
  { id: 3, title: 'Third Trimester', description: 'Advice for weeks 27-40 of pregnancy', icon: 'calendar-check' },
  { id: 4, title: 'Nutrition', description: 'Dietary recommendations during pregnancy', icon: 'heart-pulse' },
  { id: 5, title: 'Exercise', description: 'Safe physical activities for expectant mothers', icon: 'walk' },
  { id: 6, title: 'Common Symptoms', description: 'Understanding normal pregnancy symptoms', icon: 'stethoscope' },
  { id: 7, title: 'Preparing for Birth', description: 'Getting ready for labor and delivery', icon: 'home-heart' },
  { id: 8, title: 'Mental Health', description: 'Emotional wellbeing during pregnancy', icon: 'brain' },
];

const mockResources = [
  { id: 1, title: 'Prenatal Vitamin Guide', description: 'Essential nutrients for a healthy pregnancy', topicId: 4 },
  { id: 2, title: 'Safe Pregnancy Exercises', description: 'Recommended activities by trimester', topicId: 5 },
  { id: 3, title: 'Managing Morning Sickness', description: 'Tips for dealing with nausea in early pregnancy', topicId: 1 },
  { id: 4, title: 'Birth Plan Template', description: 'Creating your ideal labor and delivery experience', topicId: 7 },
  { id: 5, title: 'Recognizing Depression During Pregnancy', description: 'Signs, symptoms and when to seek help', topicId: 8 }
];