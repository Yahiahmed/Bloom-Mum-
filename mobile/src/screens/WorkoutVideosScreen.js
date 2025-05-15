import React, { useState } from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet,
  Linking
} from 'react-native';
import styles from '../styles';

export default function WorkoutVideosScreen({ navigation }) {
  const [selectedTrimester, setSelectedTrimester] = useState('first');
  
 
  const workoutVideos = {
    first: [
      {
        id: 1,
        title: "Gentle First Trimester Yoga",
        description: "A 15-minute gentle yoga routine safe for the first trimester",
        thumbnail: "https://example.com/images/first-trimester-yoga.jpg",
        url: "https://www.youtube.com/watch?v=example1",
        duration: "15 min"
      },
      {
        id: 2,
        title: "Morning Stretches for Nausea Relief",
        description: "Simple stretches to help with morning sickness and nausea",
        thumbnail: "https://example.com/images/stretches.jpg",
        url: "https://www.youtube.com/watch?v=example2",
        duration: "10 min"
      },
      {
        id: 3,
        title: "Low-Impact Cardio for Early Pregnancy",
        description: "Safe cardio workout to maintain fitness in early pregnancy",
        thumbnail: "https://example.com/images/early-cardio.jpg",
        url: "https://www.youtube.com/watch?v=example3",
        duration: "20 min"
      }
    ],
    second: [
      {
        id: 4,
        title: "Second Trimester Strength Training",
        description: "Moderate strength exercises safe for the second trimester",
        thumbnail: "https://example.com/images/second-strength.jpg",
        url: "https://www.youtube.com/watch?v=example4",
        duration: "25 min"
      },
      {
        id: 5,
        title: "Prenatal Pilates for Core Strength",
        description: "Modified pilates to maintain core strength during pregnancy",
        thumbnail: "https://example.com/images/pilates.jpg",
        url: "https://www.youtube.com/watch?v=example5",
        duration: "30 min"
      },
      {
        id: 6,
        title: "Swimming Exercises for Pregnancy",
        description: "Guided swimming workout that's gentle on joints",
        thumbnail: "https://example.com/images/swimming.jpg",
        url: "https://www.youtube.com/watch?v=example6",
        duration: "20 min"
      }
    ],
    third: [
      {
        id: 7,
        title: "Third Trimester Gentle Stretching",
        description: "Safe stretches to relieve discomfort in late pregnancy",
        thumbnail: "https://example.com/images/third-stretching.jpg",
        url: "https://www.youtube.com/watch?v=example7",
        duration: "15 min"
      },
      {
        id: 8,
        title: "Birth Ball Exercises",
        description: "Exercises using a birth ball to prepare for labor",
        thumbnail: "https://example.com/images/birth-ball.jpg",
        url: "https://www.youtube.com/watch?v=example8",
        duration: "20 min"
      },
      {
        id: 9,
        title: "Walking Routine for Late Pregnancy",
        description: "Gentle walking program to stay active before birth",
        thumbnail: "https://example.com/images/walking.jpg",
        url: "https://www.youtube.com/watch?v=example9",
        duration: "15 min"
      }
    ]
  };

  const openVideo = (url) => {
    Linking.openURL(url).catch(err => console.error('Error opening video URL:', err));
  };

  const renderVideoCard = (video) => (
    <TouchableOpacity 
      key={video.id} 
      style={localStyles.videoCard}
      onPress={() => openVideo(video.url)}
    >
      <View style={localStyles.thumbnailContainer}>
        {/* Placeholder for video thumbnail */}
        <View style={localStyles.thumbnailPlaceholder}>
          <Text style={localStyles.playIcon}>▶️</Text>
        </View>
        <View style={localStyles.durationBadge}>
          <Text style={localStyles.durationText}>{video.duration}</Text>
        </View>
      </View>
      <View style={localStyles.videoInfo}>
        <Text style={localStyles.videoTitle}>{video.title}</Text>
        <Text style={localStyles.videoDescription}>{video.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>Pregnancy Workouts</Text>
        <Text style={styles.appSubtitle}>Safe exercises for each trimester</Text>
      </View>
      
      <View style={localStyles.trimesterTabs}>
        <TouchableOpacity 
          style={[
            localStyles.trimesterTab, 
            selectedTrimester === 'first' && localStyles.selectedTab
          ]}
          onPress={() => setSelectedTrimester('first')}
        >
          <Text style={[
            localStyles.trimesterTabText,
            selectedTrimester === 'first' && localStyles.selectedTabText
          ]}>First Trimester</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            localStyles.trimesterTab, 
            selectedTrimester === 'second' && localStyles.selectedTab
          ]}
          onPress={() => setSelectedTrimester('second')}
        >
          <Text style={[
            localStyles.trimesterTabText,
            selectedTrimester === 'second' && localStyles.selectedTabText
          ]}>Second Trimester</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            localStyles.trimesterTab, 
            selectedTrimester === 'third' && localStyles.selectedTab
          ]}
          onPress={() => setSelectedTrimester('third')}
        >
          <Text style={[
            localStyles.trimesterTabText,
            selectedTrimester === 'third' && localStyles.selectedTabText
          ]}>Third Trimester</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={localStyles.videoList}>
        <View style={localStyles.safetyInfoBox}>
          <Text style={localStyles.safetyTitle}>⚠️ Important Safety Note</Text>
          <Text style={localStyles.safetyText}>
            Always consult with your healthcare provider before starting any exercise routine during pregnancy.
          </Text>
        </View>
        
        {workoutVideos[selectedTrimester].map(video => renderVideoCard(video))}
        
        <View style={localStyles.disclaimer}>
          <Text style={localStyles.disclaimerText}>
            These videos are provided for informational purposes only. Always follow your healthcare provider's recommendations.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  trimesterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  trimesterTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#9D50BB',
  },
  trimesterTabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedTabText: {
    color: '#9D50BB',
    fontWeight: 'bold',
  },
  videoList: {
    flex: 1,
    padding: 15,
  },
  videoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  thumbnailContainer: {
    height: 180,
    position: 'relative',
  },
  thumbnailPlaceholder: {
    backgroundColor: '#e1e1e1',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 50,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  videoInfo: {
    padding: 15,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  videoDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  safetyInfoBox: {
    backgroundColor: '#FFF9C4',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FBC02D',
  },
  safetyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  safetyText: {
    fontSize: 14,
    color: '#555',
  },
  disclaimer: {
    padding: 15,
    marginTop: 10,
    marginBottom: 30,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
  }
});