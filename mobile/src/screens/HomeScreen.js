import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// Using simple icon representations until we set up @expo/vector-icons
const Icons = {
  heart: "♥",
  activity: "⚡",
  chat: "💬",
  calendar: "📅",
  workout: "❤️",
  food: "🍴",
  leaf: "🌿"
};
import styles, { colors } from '../styles';

// Daily tips that will rotate
const dailyTips = [
  "Take a 10-minute walk daily to improve circulation and mood. It's a small step for you, a big leap for your baby!",
  "Stay hydrated! Aim for 8-10 glasses of water daily to support your baby's development.",
  "Include folate-rich foods like leafy greens, citrus fruits, and beans in your diet.",
  "Practice deep breathing for 5 minutes when you feel stressed. It helps both you and your baby.",
  "Sleep on your left side to improve blood flow to your heart, uterus, and kidneys."
];

export default function HomeScreen({ navigation }) {
  const [currentTip, setCurrentTip] = useState("");
  
  // Set a random daily tip when the component mounts
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * dailyTips.length);
    setCurrentTip(dailyTips[randomIndex]);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Header */}
        <Text style={localStyles.headerTitle}>Home</Text>
        
        {/* Hero Banner */}
        <View style={localStyles.heroBanner}>
          <View style={localStyles.heartIconContainer}>
            <Text style={localStyles.heartIcon}>{Icons.heart}</Text>
            <Text style={localStyles.heartBeatIcon}>{Icons.activity}</Text>
          </View>
          <Text style={localStyles.heroTitle}>Welcome to Bloom Mom</Text>
          <Text style={localStyles.heroSubtitle}>Your Pregnancy Wellness Companion</Text>
        </View>
        
        {/* Feature Grid */}
        <View style={localStyles.gridContainer}>
          <View style={localStyles.gridRow}>
            {/* Chat Bot Card */}
            <TouchableOpacity 
              style={[localStyles.featureCard, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('Chat')}
            >
              <View style={localStyles.featureIconContainer}>
                <Text style={localStyles.featureIcon}>{Icons.chat}</Text>
              </View>
              <Text style={localStyles.featureTitle}>Chat Bot</Text>
            </TouchableOpacity>
            
            {/* Calendar Card */}
            <TouchableOpacity 
              style={[localStyles.featureCard, { backgroundColor: colors.secondary }]}
              onPress={() => navigation.navigate('Health')}
            >
              <View style={localStyles.featureIconContainer}>
                <Text style={localStyles.featureIcon}>{Icons.calendar}</Text>
              </View>
              <Text style={localStyles.featureTitle}>Calendar</Text>
            </TouchableOpacity>
          </View>
          
          <View style={localStyles.gridRow}>
            {/* Workouts Card */}
            <TouchableOpacity 
              style={[localStyles.featureCard, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('Workouts')}
            >
              <View style={localStyles.featureIconContainer}>
                <Text style={localStyles.featureIcon}>{Icons.workout}</Text>
              </View>
              <Text style={localStyles.featureTitle}>Workouts</Text>
            </TouchableOpacity>
            
            {/* Recipes Card */}
            <TouchableOpacity 
              style={[localStyles.featureCard, { backgroundColor: colors.secondary }]}
              onPress={() => navigation.navigate('Recipes')}
            >
              <View style={localStyles.featureIconContainer}>
                <Text style={localStyles.featureIcon}>{Icons.food}</Text>
              </View>
              <Text style={localStyles.featureTitle}>Recipes</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Daily Tip Card */}
        <View style={localStyles.tipCard}>
          <View style={localStyles.tipHeader}>
            <Text style={localStyles.leafIcon}>{Icons.leaf}</Text>
            <Text style={localStyles.tipHeaderText}>Daily Tip</Text>
          </View>
          <Text style={localStyles.tipText}>{currentTip}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Local styles specific to this screen
const localStyles = StyleSheet.create({
  heartIcon: {
    fontSize: 60,
    color: colors.accent,
  },
  featureIcon: {
    fontSize: 32,
    color: '#FFFFFF',
  },
  leafIcon: {
    fontSize: 18,
    color: '#28A745',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  heroBanner: {
    backgroundColor: colors.primary,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  heartIconContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  heartBeatIcon: {
    position: 'absolute',
    top: 15,
    left: 25,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    marginTop: 5,
  },
  gridContainer: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  featureCard: {
    width: '48%',
    height: 150,
    borderRadius: 15,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIconContainer: {
    marginBottom: 15,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  tipCard: {
    marginHorizontal: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#333',
  },
  tipText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
});