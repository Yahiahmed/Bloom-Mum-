import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles';
import { formatDate } from '../utils/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SavedResponsesScreen({ navigation }) {
  const [savedResponses, setSavedResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSavedResponses = async () => {
      try {
        const savedData = await AsyncStorage.getItem('savedResponses');
        if (savedData) {
          setSavedResponses(JSON.parse(savedData));
        }
      } catch (error) {
        console.error('Error loading saved responses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedResponses();
  }, []);

  const handleDelete = async (id) => {
    try {
      const updatedResponses = savedResponses.filter(item => item.id !== id);
      setSavedResponses(updatedResponses);
      await AsyncStorage.setItem('savedResponses', JSON.stringify(updatedResponses));
    } catch (error) {
      console.error('Error deleting saved response:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.screenTitle}>Saved Responses</Text>
      {savedResponses.length > 0 ? (
        <FlatList
          data={savedResponses}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.savedResponseCard}>
              <Text style={styles.savedResponseTitle}>{item.question}</Text>
              <Text style={styles.savedResponseText}>{item.answer}</Text>
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10
              }}>
                <Text style={styles.savedResponseDate}>
                  {formatDate(item.timestamp)}
                </Text>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={{
                    padding: 5,
                    backgroundColor: '#f8d7da',
                    borderRadius: 5
                  }}
                >
                  <Text style={{ color: '#721c24' }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={styles.savedResponsesList}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No saved responses yet</Text>
          <Text style={styles.emptyStateSubtext}>
            When you receive a helpful response in chat, tap the bookmark icon to save it for future reference.
          </Text>
          <TouchableOpacity 
            style={[styles.ctaButton, { marginTop: 20 }]}
            onPress={() => navigation.navigate('Chat')}
          >
            <Text style={styles.ctaButtonText}>Start Chatting</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}