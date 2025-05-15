import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, Text } from 'react-native';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import ChatScreen from './src/screens/ChatScreen';
import TopicsScreen from './src/screens/TopicsScreen';
import ResourcesScreen from './src/screens/ResourcesScreen';
import SavedResponsesScreen from './src/screens/SavedResponsesScreen';
import WorkoutVideosScreen from './src/screens/WorkoutVideosScreen';
import RecipesScreen from './src/screens/RecipesScreen';
import HealthTrackerScreen from './src/screens/HealthTrackerScreen';

// Navigation setup
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TopicsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="TopicsList" 
        component={TopicsScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Resources" 
        component={ResourcesScreen} 
        options={({ route }) => ({ 
          title: route.params?.topicName || 'Resources',
          headerShown: false 
        })}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconText = '📋';
            
            if (route.name === 'Home') iconText = '🏠';
            else if (route.name === 'Chat') iconText = '💬';
            else if (route.name === 'Topics') iconText = '📚';
            else if (route.name === 'Workouts') iconText = '🏋️‍♀️';
            else if (route.name === 'Recipes') iconText = '🍎';
            else if (route.name === 'Health') iconText = '🩺';
            else if (route.name === 'Saved') iconText = '💾';
            
            return <Text style={{fontSize: 20}}>{iconText}</Text>;
          },
          tabBarActiveTintColor: '#9D50BB',
          tabBarInactiveTintColor: 'gray',
          headerShown: false
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Chat" component={ChatScreen} />
        <Tab.Screen name="Topics" component={TopicsStack} />
        <Tab.Screen name="Workouts" component={WorkoutVideosScreen} />
        <Tab.Screen name="Recipes" component={RecipesScreen} />
        <Tab.Screen name="Health" component={HealthTrackerScreen} />
        <Tab.Screen name="Saved" component={SavedResponsesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}