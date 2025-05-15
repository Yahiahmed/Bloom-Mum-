import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import styles from '../styles';
import { iconToEmoji } from '../utils/helpers';
import { getTopics } from '../services/api';

export default function TopicsScreen({ navigation }) {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await getTopics();
        setTopics(data);
      } catch (error) {
        console.error('Error fetching topics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#9D50BB" />
        <Text style={{ marginTop: 20, fontSize: 16 }}>Loading topics...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.screenTitle}>Pregnancy Topics</Text>
      <FlatList
        data={topics}
        keyExtractor={item => item.id?.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.topicListItem}
            onPress={() => navigation.navigate('Resources', { 
              topicId: item.id, 
              topicName: item.title 
            })}
          >
            <Text style={styles.topicListIcon}>{iconToEmoji(item.icon)}</Text>
            <View style={styles.topicListContent}>
              <Text style={styles.topicListTitle}>{item.title}</Text>
              <Text style={styles.topicListDescription}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.topicsList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No topics found</Text>
            <Text style={styles.emptyStateSubtext}>
              Check your internet connection or try again later.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}