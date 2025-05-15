// Helper function to convert icon names to emojis for demo
export const iconToEmoji = (icon) => {
  const emojiMap = {
    'calendar': '📅',
    'calendar-check': '📆',
    'heart-pulse': '❤️',
    'walk': '🚶‍♀️',
    'stethoscope': '🩺',
    'home-heart': '🏠',
    'brain': '🧠',
  };
  
  return emojiMap[icon] || '📋';
};

// Format date for display
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString();
};

// Format time for message bubbles
export const formatTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
};

// Truncate long text
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};