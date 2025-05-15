import React, { useState, useEffect, useRef } from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import styles from '../styles';
import { formatTime } from '../utils/helpers';
import { getAIResponse, getMessages } from '../services/api';

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const flatListRef = useRef(null);

  // Load existing conversation if available
  useEffect(() => {
    const loadConversation = async () => {
      // In a real app, you would get the active conversation ID from storage or state
      const activeConversationId = 1; // Just for demo
      
      if (activeConversationId) {
        try {
          const data = await getMessages(activeConversationId);
          if (data && data.length > 0) {
            setMessages(data);
            setConversationId(activeConversationId);
          }
        } catch (error) {
          console.error('Error loading conversation:', error);
        }
      }
    };

    loadConversation();
  }, []);

  const sendMessage = async () => {
    if (inputText.trim() === '') return;
    
    const userMessage = {
      id: Date.now(),
      content: inputText,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');
    setIsLoading(true);
    
    try {
      const response = await getAIResponse(inputText);
      
      // In a real app, both messages would be returned from the API
      // Here we're simulating the response
      const aiMessage = {
        id: Date.now() + 1,
        content: response.aiResponse?.content || 'Sorry, I couldn\'t process your request.',
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, aiMessage]);
      
      // If this is a new conversation, we would get the ID from the API
      if (!conversationId && response.conversationId) {
        setConversationId(response.conversationId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.chatContainer}
        keyboardVerticalOffset={100}
      >
        <Text style={styles.screenTitle}>Chat with AI Assistant</Text>
        
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[
              styles.messageBubble,
              item.role === 'user' ? styles.userBubble : styles.assistantBubble
            ]}>
              <Text style={[
                styles.messageText,
                item.role === 'user' ? styles.userMessageText : {}
              ]}>
                {item.content}
              </Text>
              <Text style={styles.timestampText}>
                {formatTime(item.timestamp)}
              </Text>
            </View>
          )}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#9D50BB" />
            <Text style={styles.loadingText}>Assistant is typing...</Text>
          </View>
        )}
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask a question about pregnancy..."
            placeholderTextColor="#999"
            multiline
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              inputText.trim() === '' ? { opacity: 0.7 } : {}
            ]} 
            onPress={sendMessage}
            disabled={inputText.trim() === '' || isLoading}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}