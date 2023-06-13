import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  FlatList,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Picker } from '@react-native-picker/picker';
import { Image } from 'react-native';

// This is the main function for the Health Goals Screen
function HealthGoalsScreen() {
  return (
    <View style={styles.text}>
      <Text>Health Goals!</Text>
    </View>
  );
}

function FoodDatabaseScreen() {
  return (
    <View style={styles.text}>
      <Text>Food Database!</Text>
    </View>
  );

  const addToMealPlan = (item) => {
    setLSelectedFoodItem(item);
    setLModalVisible(true);
  };

  const handleMealSelection = (itemValue) => {
    if (lSelectedFoodItem) {
      let mealToAdd = itemValue;

      setLMealPlan((prevPlan) => ({
        ...prevPlan,
        [mealToAdd]: [...prevPlan[mealToAdd], lSelectedFoodItem],
      }));

      Alert.alert('Success', 'The food has been added to your meal plan');

      setLSelectedFoodItem(null); // Reset the selectedFoodItem state after adding
      setLSelectedMeal(''); // Reset the selectedMeal state after adding
    }
    setLModalVisible(false); // Hide the modal after adding
  };

  const handleModalClose = () => {
    setLModalVisible(false);
  };

  return (
    <View style={styles.text}>
      <Text>Meal Planning!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollview: {
    paddingRight: 10,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    color: '#293FA6',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 15,
    overflow: 'hidden',
  },
  logo: {
    color: '#000000',
    width: 10,
    height: 10,
  },
  image: {
    marginTop: 10,
    marginBottom: 10,
    width: 200,
    height: 150,
  },
  foodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#293FA6',
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 15,
    width: 200,
    alignItems: 'center', // center the text horizontally
    justifyContent: 'center', // center the text vertically
    padding: 10, // give some space around the text
  },
  buttonText: {
    color: '#fff', // make the text white
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // semi-transparent background
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%', // set to a percentage of screen width
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20, // add some space below the text
  },
});
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Health Goals"
          component={HealthGoalsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Image
                source={require('./goal.png')}
                style={{ height: size, width: size, tintColor: color }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Food Database"
          component={FoodDatabaseScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Image
                source={require('./diet.png')}
                style={{ height: size, width: size, tintColor: color }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Meal Planning"
          component={MealPlanningScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Image
                source={require('./calendar.png')}
                style={{ height: size, width: size, tintColor: color }}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
