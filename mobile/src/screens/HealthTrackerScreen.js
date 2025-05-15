import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Switch
} from 'react-native';
import styles from '../styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatDate } from '../utils/helpers';

export default function HealthTrackerScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('checkups');
  const [checkups, setCheckups] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [nutritionTracking, setNutritionTracking] = useState([]);
  
  // Form states
  const [newCheckupDate, setNewCheckupDate] = useState('');
  const [newCheckupTime, setNewCheckupTime] = useState('');
  const [newCheckupDoctor, setNewCheckupDoctor] = useState('');
  const [newCheckupNotes, setNewCheckupNotes] = useState('');
  
  const [newReminderName, setNewReminderName] = useState('');
  const [newReminderTime, setNewReminderTime] = useState('');
  const [newReminderDays, setNewReminderDays] = useState({
    mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false
  });
  
  const [trackedNutrients, setTrackedNutrients] = useState({
    folicAcid: { taken: false, goal: '400-800 mcg' },
    iron: { taken: false, goal: '27 mg' },
    calcium: { taken: false, goal: '1000 mg' },
    vitaminD: { taken: false, goal: '600 IU' },
    omega3: { taken: false, goal: '300 mg DHA' },
    water: { amount: 0, goal: 8 }
  });
  
  // Load data from AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load checkups
        const checkupsData = await AsyncStorage.getItem('checkups');
        if (checkupsData) {
          setCheckups(JSON.parse(checkupsData));
        }
        
        // Load reminders
        const remindersData = await AsyncStorage.getItem('reminders');
        if (remindersData) {
          setReminders(JSON.parse(remindersData));
        }
        
        // Load nutrition tracking
        const nutritionData = await AsyncStorage.getItem('nutritionTracking');
        if (nutritionData) {
          setNutritionTracking(JSON.parse(nutritionData));
        }
        
        // Load tracked nutrients for today
        const nutrientsData = await AsyncStorage.getItem('trackedNutrients');
        if (nutrientsData) {
          const parsed = JSON.parse(nutrientsData);
          // Check if the data is from today
          const today = new Date().toDateString();
          if (parsed.date === today) {
            setTrackedNutrients(parsed.nutrients);
          }
        }
      } catch (error) {
        console.error('Error loading health tracking data:', error);
      }
    };
    
    loadData();
  }, []);
  
  // Save checkups to AsyncStorage
  const saveCheckups = async (updatedCheckups) => {
    try {
      await AsyncStorage.setItem('checkups', JSON.stringify(updatedCheckups));
      setCheckups(updatedCheckups);
    } catch (error) {
      console.error('Error saving checkups:', error);
      Alert.alert('Error', 'Failed to save appointment. Please try again.');
    }
  };
  
  // Save reminders to AsyncStorage
  const saveReminders = async (updatedReminders) => {
    try {
      await AsyncStorage.setItem('reminders', JSON.stringify(updatedReminders));
      setReminders(updatedReminders);
    } catch (error) {
      console.error('Error saving reminders:', error);
      Alert.alert('Error', 'Failed to save reminder. Please try again.');
    }
  };
  
  // Save nutrition tracking to AsyncStorage
  const saveNutritionTracking = async (updatedNutrients) => {
    try {
      const today = new Date().toDateString();
      await AsyncStorage.setItem('trackedNutrients', JSON.stringify({
        date: today,
        nutrients: updatedNutrients
      }));
      setTrackedNutrients(updatedNutrients);
      
      // Also save to history
      const newEntry = {
        date: today,
        nutrients: updatedNutrients
      };
      
      const history = [...nutritionTracking];
      const existingEntryIndex = history.findIndex(entry => entry.date === today);
      
      if (existingEntryIndex >= 0) {
        history[existingEntryIndex] = newEntry;
      } else {
        history.push(newEntry);
      }
      
      await AsyncStorage.setItem('nutritionTracking', JSON.stringify(history));
      setNutritionTracking(history);
    } catch (error) {
      console.error('Error saving nutrition tracking:', error);
      Alert.alert('Error', 'Failed to save nutrition data. Please try again.');
    }
  };
  
  // Add new checkup appointment
  const addCheckup = () => {
    if (!newCheckupDate || !newCheckupTime || !newCheckupDoctor) {
      Alert.alert('Missing Information', 'Please fill in date, time and doctor name.');
      return;
    }
    
    const newCheckup = {
      id: Date.now(),
      date: newCheckupDate,
      time: newCheckupTime,
      doctor: newCheckupDoctor,
      notes: newCheckupNotes,
      completed: false
    };
    
    const updatedCheckups = [...checkups, newCheckup];
    saveCheckups(updatedCheckups);
    
    // Clear form
    setNewCheckupDate('');
    setNewCheckupTime('');
    setNewCheckupDoctor('');
    setNewCheckupNotes('');
    
    Alert.alert('Success', 'Appointment added successfully!');
  };
  
  // Add new reminder
  const addReminder = () => {
    if (!newReminderName || !newReminderTime) {
      Alert.alert('Missing Information', 'Please fill in reminder name and time.');
      return;
    }
    
    // Check if at least one day is selected
    const anyDaySelected = Object.values(newReminderDays).some(day => day);
    if (!anyDaySelected) {
      Alert.alert('Missing Information', 'Please select at least one day for the reminder.');
      return;
    }
    
    const newReminder = {
      id: Date.now(),
      name: newReminderName,
      time: newReminderTime,
      days: newReminderDays,
      active: true
    };
    
    const updatedReminders = [...reminders, newReminder];
    saveReminders(updatedReminders);
    
    // Clear form
    setNewReminderName('');
    setNewReminderTime('');
    setNewReminderDays({
      mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false
    });
    
    Alert.alert('Success', 'Reminder added successfully!');
  };
  
  // Toggle nutrient taken status
  const toggleNutrientTaken = (nutrient) => {
    const updatedNutrients = {
      ...trackedNutrients,
      [nutrient]: {
        ...trackedNutrients[nutrient],
        taken: !trackedNutrients[nutrient].taken
      }
    };
    
    saveNutritionTracking(updatedNutrients);
  };
  
  // Update water intake
  const updateWaterIntake = (action) => {
    const currentAmount = trackedNutrients.water.amount;
    let newAmount;
    
    if (action === 'increase') {
      newAmount = currentAmount + 1;
    } else if (action === 'decrease') {
      newAmount = Math.max(0, currentAmount - 1);
    }
    
    const updatedNutrients = {
      ...trackedNutrients,
      water: {
        ...trackedNutrients.water,
        amount: newAmount
      }
    };
    
    saveNutritionTracking(updatedNutrients);
  };
  
  // Delete checkup
  const deleteCheckup = (id) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this appointment?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedCheckups = checkups.filter(checkup => checkup.id !== id);
            saveCheckups(updatedCheckups);
          },
        },
      ]
    );
  };
  
  // Delete reminder
  const deleteReminder = (id) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this reminder?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedReminders = reminders.filter(reminder => reminder.id !== id);
            saveReminders(updatedReminders);
          },
        },
      ]
    );
  };
  
  // Toggle reminder active status
  const toggleReminderActive = (id) => {
    const updatedReminders = reminders.map(reminder => {
      if (reminder.id === id) {
        return { ...reminder, active: !reminder.active };
      }
      return reminder;
    });
    
    saveReminders(updatedReminders);
  };
  
  // Toggle checkup completed status
  const toggleCheckupCompleted = (id) => {
    const updatedCheckups = checkups.map(checkup => {
      if (checkup.id === id) {
        return { ...checkup, completed: !checkup.completed };
      }
      return checkup;
    });
    
    saveCheckups(updatedCheckups);
  };
  
  // Render checkups tab content
  const renderCheckupsTab = () => (
    <View style={localStyles.tabContent}>
      <Text style={localStyles.sectionTitle}>Upcoming Appointments</Text>
      
      {checkups.length > 0 ? (
        checkups.map(checkup => (
          <View key={checkup.id} style={[
            localStyles.checkupCard,
            checkup.completed ? localStyles.completedCheckup : {}
          ]}>
            <View style={localStyles.checkupHeader}>
              <View>
                <Text style={localStyles.checkupDoctor}>{checkup.doctor}</Text>
                <Text style={localStyles.checkupDateTime}>
                  {checkup.date} at {checkup.time}
                </Text>
              </View>
              
              <View style={localStyles.checkupActions}>
                <TouchableOpacity 
                  style={[
                    localStyles.iconButton,
                    checkup.completed ? localStyles.completedButton : {}
                  ]}
                  onPress={() => toggleCheckupCompleted(checkup.id)}
                >
                  <Text>✓</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[localStyles.iconButton, localStyles.deleteButton]}
                  onPress={() => deleteCheckup(checkup.id)}
                >
                  <Text>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {checkup.notes ? (
              <Text style={localStyles.checkupNotes}>{checkup.notes}</Text>
            ) : null}
          </View>
        ))
      ) : (
        <Text style={localStyles.emptyMessage}>No appointments scheduled. Add your first checkup below.</Text>
      )}
      
      <View style={localStyles.formSection}>
        <Text style={localStyles.formSectionTitle}>Add New Appointment</Text>
        
        <TextInput
          style={localStyles.input}
          placeholder="Date (e.g., 2025-06-15)"
          value={newCheckupDate}
          onChangeText={setNewCheckupDate}
        />
        
        <TextInput
          style={localStyles.input}
          placeholder="Time (e.g., 10:30 AM)"
          value={newCheckupTime}
          onChangeText={setNewCheckupTime}
        />
        
        <TextInput
          style={localStyles.input}
          placeholder="Doctor/Clinic Name"
          value={newCheckupDoctor}
          onChangeText={setNewCheckupDoctor}
        />
        
        <TextInput
          style={[localStyles.input, localStyles.textArea]}
          placeholder="Notes (optional)"
          value={newCheckupNotes}
          onChangeText={setNewCheckupNotes}
          multiline
          numberOfLines={3}
        />
        
        <TouchableOpacity 
          style={localStyles.addButton}
          onPress={addCheckup}
        >
          <Text style={localStyles.addButtonText}>Add Appointment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  // Render reminders tab content
  const renderRemindersTab = () => (
    <View style={localStyles.tabContent}>
      <Text style={localStyles.sectionTitle}>Nutrient & Medication Reminders</Text>
      
      {reminders.length > 0 ? (
        reminders.map(reminder => (
          <View key={reminder.id} style={localStyles.reminderCard}>
            <View style={localStyles.reminderHeader}>
              <View>
                <Text style={localStyles.reminderName}>{reminder.name}</Text>
                <Text style={localStyles.reminderTime}>{reminder.time}</Text>
                <Text style={localStyles.reminderDays}>
                  {Object.entries(reminder.days)
                    .filter(([day, selected]) => selected)
                    .map(([day]) => day[0].toUpperCase() + day.slice(1, 3))
                    .join(', ')}
                </Text>
              </View>
              
              <View style={localStyles.reminderActions}>
                <Switch
                  value={reminder.active}
                  onValueChange={() => toggleReminderActive(reminder.id)}
                  trackColor={{ false: '#e1e1e1', true: '#9D50BB' }}
                  thumbColor={reminder.active ? '#fff' : '#f4f3f4'}
                />
                
                <TouchableOpacity 
                  style={[localStyles.iconButton, localStyles.deleteButton, { marginLeft: 8 }]}
                  onPress={() => deleteReminder(reminder.id)}
                >
                  <Text>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      ) : (
        <Text style={localStyles.emptyMessage}>No reminders set. Add your first reminder below.</Text>
      )}
      
      <View style={localStyles.formSection}>
        <Text style={localStyles.formSectionTitle}>Add New Reminder</Text>
        
        <TextInput
          style={localStyles.input}
          placeholder="Reminder Name (e.g., Prenatal Vitamin)"
          value={newReminderName}
          onChangeText={setNewReminderName}
        />
        
        <TextInput
          style={localStyles.input}
          placeholder="Time (e.g., 08:00 AM)"
          value={newReminderTime}
          onChangeText={setNewReminderTime}
        />
        
        <Text style={localStyles.daysLabel}>Select Days:</Text>
        <View style={localStyles.daysContainer}>
          {Object.keys(newReminderDays).map(day => (
            <TouchableOpacity
              key={day}
              style={[
                localStyles.dayButton,
                newReminderDays[day] ? localStyles.selectedDayButton : {}
              ]}
              onPress={() => setNewReminderDays({
                ...newReminderDays,
                [day]: !newReminderDays[day]
              })}
            >
              <Text style={[
                localStyles.dayButtonText,
                newReminderDays[day] ? localStyles.selectedDayButtonText : {}
              ]}>{day[0].toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity 
          style={localStyles.addButton}
          onPress={addReminder}
        >
          <Text style={localStyles.addButtonText}>Add Reminder</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  // Render nutrition tracking tab content
  const renderNutritionTab = () => (
    <View style={localStyles.tabContent}>
      <Text style={localStyles.sectionTitle}>Daily Nutrient Tracking</Text>
      <Text style={localStyles.dateLabel}>Today: {new Date().toDateString()}</Text>
      
      <View style={localStyles.nutrientsList}>
        <View style={localStyles.nutrientItem}>
          <View>
            <Text style={localStyles.nutrientName}>Folic Acid</Text>
            <Text style={localStyles.nutrientGoal}>Goal: {trackedNutrients.folicAcid.goal}</Text>
          </View>
          <TouchableOpacity
            style={[
              localStyles.checkButton,
              trackedNutrients.folicAcid.taken ? localStyles.checkedButton : {}
            ]}
            onPress={() => toggleNutrientTaken('folicAcid')}
          >
            <Text style={localStyles.checkButtonText}>
              {trackedNutrients.folicAcid.taken ? '✓ Taken' : 'Mark as Taken'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={localStyles.nutrientItem}>
          <View>
            <Text style={localStyles.nutrientName}>Iron</Text>
            <Text style={localStyles.nutrientGoal}>Goal: {trackedNutrients.iron.goal}</Text>
          </View>
          <TouchableOpacity
            style={[
              localStyles.checkButton,
              trackedNutrients.iron.taken ? localStyles.checkedButton : {}
            ]}
            onPress={() => toggleNutrientTaken('iron')}
          >
            <Text style={localStyles.checkButtonText}>
              {trackedNutrients.iron.taken ? '✓ Taken' : 'Mark as Taken'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={localStyles.nutrientItem}>
          <View>
            <Text style={localStyles.nutrientName}>Calcium</Text>
            <Text style={localStyles.nutrientGoal}>Goal: {trackedNutrients.calcium.goal}</Text>
          </View>
          <TouchableOpacity
            style={[
              localStyles.checkButton,
              trackedNutrients.calcium.taken ? localStyles.checkedButton : {}
            ]}
            onPress={() => toggleNutrientTaken('calcium')}
          >
            <Text style={localStyles.checkButtonText}>
              {trackedNutrients.calcium.taken ? '✓ Taken' : 'Mark as Taken'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={localStyles.nutrientItem}>
          <View>
            <Text style={localStyles.nutrientName}>Vitamin D</Text>
            <Text style={localStyles.nutrientGoal}>Goal: {trackedNutrients.vitaminD.goal}</Text>
          </View>
          <TouchableOpacity
            style={[
              localStyles.checkButton,
              trackedNutrients.vitaminD.taken ? localStyles.checkedButton : {}
            ]}
            onPress={() => toggleNutrientTaken('vitaminD')}
          >
            <Text style={localStyles.checkButtonText}>
              {trackedNutrients.vitaminD.taken ? '✓ Taken' : 'Mark as Taken'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={localStyles.nutrientItem}>
          <View>
            <Text style={localStyles.nutrientName}>Omega-3 DHA</Text>
            <Text style={localStyles.nutrientGoal}>Goal: {trackedNutrients.omega3.goal}</Text>
          </View>
          <TouchableOpacity
            style={[
              localStyles.checkButton,
              trackedNutrients.omega3.taken ? localStyles.checkedButton : {}
            ]}
            onPress={() => toggleNutrientTaken('omega3')}
          >
            <Text style={localStyles.checkButtonText}>
              {trackedNutrients.omega3.taken ? '✓ Taken' : 'Mark as Taken'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={localStyles.waterTracking}>
          <View>
            <Text style={localStyles.nutrientName}>Water Intake</Text>
            <Text style={localStyles.nutrientGoal}>
              Goal: {trackedNutrients.water.goal} glasses
            </Text>
          </View>
          
          <View style={localStyles.waterControls}>
            <TouchableOpacity
              style={localStyles.waterButton}
              onPress={() => updateWaterIntake('decrease')}
              disabled={trackedNutrients.water.amount <= 0}
            >
              <Text style={localStyles.waterButtonText}>−</Text>
            </TouchableOpacity>
            
            <View style={localStyles.waterAmount}>
              <Text style={localStyles.waterAmountText}>
                {trackedNutrients.water.amount} / {trackedNutrients.water.goal}
              </Text>
            </View>
            
            <TouchableOpacity
              style={localStyles.waterButton}
              onPress={() => updateWaterIntake('increase')}
            >
              <Text style={localStyles.waterButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      <View style={localStyles.nutritionHistorySection}>
        <Text style={localStyles.formSectionTitle}>Tracking History</Text>
        
        {nutritionTracking.length > 0 ? (
          <ScrollView style={localStyles.historyList}>
            {nutritionTracking
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 7) // Show last 7 days
              .map((entry, index) => (
                <View key={index} style={localStyles.historyItem}>
                  <Text style={localStyles.historyDate}>{entry.date}</Text>
                  <View style={localStyles.historyNutrients}>
                    {Object.entries(entry.nutrients)
                      .filter(([key, value]) => key !== 'water' && 'taken' in value)
                      .map(([key, value]) => (
                        <View key={key} style={localStyles.historyNutrient}>
                          <Text style={localStyles.historyNutrientName}>
                            {key === 'folicAcid' ? 'Folic Acid' : 
                             key === 'vitaminD' ? 'Vitamin D' : 
                             key === 'omega3' ? 'Omega-3' : key.charAt(0).toUpperCase() + key.slice(1)}
                          </Text>
                          <Text style={[
                            localStyles.historyNutrientStatus,
                            value.taken ? localStyles.takenStatus : localStyles.missedStatus
                          ]}>
                            {value.taken ? '✓' : '✗'}
                          </Text>
                        </View>
                      ))}
                    
                    <View style={localStyles.historyWater}>
                      <Text style={localStyles.historyNutrientName}>Water</Text>
                      <Text style={localStyles.historyWaterAmount}>
                        {entry.nutrients.water.amount}/{entry.nutrients.water.goal}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
          </ScrollView>
        ) : (
          <Text style={localStyles.emptyMessage}>
            No tracking history yet. Start tracking today!
          </Text>
        )}
      </View>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>Health Tracker</Text>
        <Text style={styles.appSubtitle}>Monitor your pregnancy journey</Text>
      </View>
      
      <View style={localStyles.tabsContainer}>
        <TouchableOpacity
          style={[localStyles.tab, activeTab === 'checkups' && localStyles.activeTab]}
          onPress={() => setActiveTab('checkups')}
        >
          <Text style={[localStyles.tabText, activeTab === 'checkups' && localStyles.activeTabText]}>
            Checkups
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[localStyles.tab, activeTab === 'reminders' && localStyles.activeTab]}
          onPress={() => setActiveTab('reminders')}
        >
          <Text style={[localStyles.tabText, activeTab === 'reminders' && localStyles.activeTabText]}>
            Reminders
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[localStyles.tab, activeTab === 'nutrition' && localStyles.activeTab]}
          onPress={() => setActiveTab('nutrition')}
        >
          <Text style={[localStyles.tabText, activeTab === 'nutrition' && localStyles.activeTabText]}>
            Nutrition
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={localStyles.contentContainer}>
        {activeTab === 'checkups' && renderCheckupsTab()}
        {activeTab === 'reminders' && renderRemindersTab()}
        {activeTab === 'nutrition' && renderNutritionTab()}
      </ScrollView>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#9D50BB',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#9D50BB',
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
  },
  tabContent: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  dateLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  checkupCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  completedCheckup: {
    backgroundColor: '#f5f5f5',
    opacity: 0.7,
  },
  checkupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  checkupDoctor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  checkupDateTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  checkupNotes: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    fontStyle: 'italic',
  },
  checkupActions: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f1f1f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  completedButton: {
    backgroundColor: '#9ae6b4',
  },
  deleteButton: {
    backgroundColor: '#fed7d7',
  },
  formSection: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e1e1e1',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#9D50BB',
    borderRadius: 5,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginVertical: 20,
  },
  reminderCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  reminderTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  reminderDays: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  reminderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  daysLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#555',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
  },
  selectedDayButton: {
    backgroundColor: '#9D50BB',
  },
  dayButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  selectedDayButtonText: {
    color: '#fff',
  },
  nutrientsList: {
    marginTop: 10,
  },
  nutrientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  nutrientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  nutrientGoal: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  checkButton: {
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
  },
  checkedButton: {
    backgroundColor: '#9ae6b4',
  },
  checkButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
  },
  waterTracking: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#e6f7ff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  waterControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waterButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  waterButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  waterAmount: {
    paddingHorizontal: 10,
    minWidth: 60,
    alignItems: 'center',
  },
  waterAmountText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  nutritionHistorySection: {
    marginTop: 20,
  },
  historyList: {
    maxHeight: 300,
  },
  historyItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  historyNutrients: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  historyNutrient: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 8,
  },
  historyNutrientName: {
    fontSize: 12,
    color: '#666',
    marginRight: 5,
  },
  historyNutrientStatus: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  takenStatus: {
    color: '#38a169',
  },
  missedStatus: {
    color: '#e53e3e',
  },
  historyWater: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyWaterAmount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3182ce',
  }
});