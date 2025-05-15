import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, View, Text, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import styles from '../styles';
import { getResources } from '../services/api';

export default function ResourcesScreen({ route, navigation }) {
  const { topicId, topicName } = route.params || { topicId: null, topicName: 'All Resources' };
  
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await getResources(topicId);
        setResources(data);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, [topicId]);

  const handleResourcePress = (link) => {
    if (link) {
      // Open link in browser
      Linking.openURL(link).catch(err => 
        console.error('Error opening link:', err)
      );
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#9D50BB" />
        <Text style={{ marginTop: 20, fontSize: 16 }}>Loading resources...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20 }}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={{ marginRight: 10 }}
        >
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>{topicName}</Text>
      </View>

      {resources.length > 0 ? (
        <FlatList
          data={resources}
          keyExtractor={item => item.id?.toString()}
          renderItem={({ item }) => (
            <View style={styles.resourceCard}>
              <Text style={styles.resourceTitle}>{item.title}</Text>
              <Text style={styles.resourceDescription}>{item.description}</Text>
              {item.link && (
                <TouchableOpacity 
                  style={styles.resourceButton}
                  onPress={() => handleResourcePress(item.link)}
                >
                  <Text style={styles.resourceButtonText}>Learn More</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          contentContainerStyle={styles.resourcesList}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No resources found</Text>
          <Text style={styles.emptyStateSubtext}>
            We'll be adding more resources for this topic soon.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}