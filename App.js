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
  // Setting up global states for age, gender, height, weight, activity level and health goal
  const [lAge, setAge] = useState('');
  const [lGender, setGender] = useState(null);
  const [lHeight, setHeight] = useState('');
  const [lWeight, setWeight] = useState('');
  const [lActivityLevel, setActivityLevel] = useState(null);
  const [lHealthGoal, setHealthGoal] = useState(null);

  // Checking if all the form fields are filled correctly
  const lIsFormValid =
    lAge !== '' &&
    lGender !== null &&
    lGender !== 'Select your gender' &&
    lHeight !== '' &&
    lWeight !== '' &&
    lActivityLevel !== null &&
    lActivityLevel !== 'Select your activity level' &&
    lHealthGoal !== null &&
    lHealthGoal !== 'Select your health goal';

  // Setting up state for caloric intake and show results
  const [lCaloricIntake, setCaloricIntake] = useState(0);
  const [lShowResults, setShowResults] = useState(false);
  const [lInputTextWeight, setInputText] = useState('');

  // Function to handle input change
  const handleInputChange = (setter) => (value) => {
    setShowResults(false);
    setter(value);
  };

  // Use effect function to calculate caloric intake when all form fields are filled
  useEffect(() => {
    if (lIsFormValid) {
      calculateCaloricIntake();
    }
  }, [lAge, lGender, lHeight, lWeight, lActivityLevel, lHealthGoal]);

  // Function to calculate BMR
  const calculateBMR = () => {
    let lBMR;
    if (lGender === 'male') {
      lBMR = 88.362 + 13.397 * lWeight + 4.799 * lHeight - 5.677 * lAge;
    } else {
      lBMR = 447.593 + 9.247 * lWeight + 3.098 * lHeight - 4.33 * lAge;
    }
    return lBMR;
  };

  // Function to calculate caloric intake
  const calculateCaloricIntake = () => {
    let lBMR = calculateBMR();
    let lActivityFactor = 1.2;
    switch (lActivityLevel) {
      case 'light':
        lActivityFactor = 1.375;
        break;
      case 'moderate':
        lActivityFactor = 1.55;
        break;
      case 'heavy':
        lActivityFactor = 1.725;
        break;
      case 'extra':
        lActivityFactor = 1.9;
        break;
    }
    let lTotalCalories = lBMR * lActivityFactor;
    switch (lHealthGoal) {
      case 'loss':
        lTotalCalories -= 500;
        break;
      case 'gain':
        lTotalCalories += 500;
        break;
    }
    setCaloricIntake(Math.round(lTotalCalories));
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <ScrollView style={styles.scrollview} keyboardShouldPersistTaps="handled">
          <Text style={styles.label}>Age:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              // Exclude unwanted characters
              let lNewText = text.replace(/[^0-9]/g, '');
              handleInputChange(lNewText);
            }}
            value={lAge}
            keyboardType="numeric"
            maxLength={3}
            minLength={1}
          />

          <Text style={styles.label}>Gender:</Text>
          <Picker
            style={styles.picker}
            selectedValue={lGender}
            prompt="Select your gender"
            onValueChange={handleInputChange(
              (itemValue) => itemValue !== 'default' && setGender(itemValue)
            )}>
            <Picker.Item label="Select your gender" value="default" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
          </Picker>
          <Text style={styles.label}>Height (cm):</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              // Exclude unwanted characters
              let lNewText = text.replace(/[^0-9]/g, '');
              handleInputChange(lNewText);
            }}
            value={lHeight}
            keyboardType="numeric"
            maxLength={3}
            minLength={1}
          />
          <Text style={styles.label}>Weight (kg):</Text>
          <TextInput
            style={styles.input}
            value={lInputTextWeight}
            onChangeText={(text) => {
              // Allow numbers and a single decimal point
              let newText = text.replace(/[^0-9\.]/g, '');
              if (newText.split('.').length > 2) {
                // Prevent more than one dot
                return;
              }
              // Update the text manually
              setInputText(newText);
            }}
            keyboardType="decimal-pad" // Use decimal-pad to allow both numbers and decimal point
            maxLength={6} // Allow up to 3 digits before and after decimal point
          />
          <Text style={styles.label}>Activity Level:</Text>
          <Picker
            style={styles.picker}
            selectedValue={lActivityLevel}
            prompt="Select your activity level"
            onValueChange={handleInputChange(
              (itemValue) => itemValue !== 'default' && setActivityLevel(itemValue)
            )}>
            <Picker.Item label="Select your activity level" value="default" />
            <Picker.Item label="Sedentary" value="sedentary" />
            <Picker.Item label="Light Exercise" value="light" />
            <Picker.Item label="Moderate Exercise" value="moderate" />
            <Picker.Item label="Heavy Exercise" value="heavy" />
            <Picker.Item label="Extra Active" value="extra" />
          </Picker>
          <Text style={styles.label}>Health Goal:</Text>
          <Picker
            style={styles.picker}
            selectedValue={lHealthGoal}
            prompt="Select your Health goal"
            onValueChange={handleInputChange(
              (itemValue) => itemValue !== 'default' && setHealthGoal(itemValue)
            )}>
            <Picker.Item label="Select your health goal" value="default" />
            <Picker.Item label="Weight Loss" value="loss" />
            <Picker.Item label="Weight Maintenance" value="maintenance" />
            <Picker.Item label="Weight Gain" value="gain" />
          </Picker>
          <Button
            title="Submit"
            onPress={() => {
              setShowResults(true);
            }}
            disabled={!lIsFormValid}
          />
        </ScrollView>
        {lShowResults && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>Daily Caloric Intake: {lCaloricIntake}</Text>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

function FoodDatabaseScreen() {
  const [lSearchQuery, setLSearchQuery] = useState('');
  const [lFoods, setLFoods] = useState([]);
  const [lMealPlan, setLMealPlan] = useState({
    Breakfast: [],
    Lunch: [],
    Snack: [],
    Dinner: [],
  });
  const [lSelectedMeal, setLSelectedMeal] = useState('');
  const [lModalVisible, setLModalVisible] = useState(false);
  const handleInputChange = (value) => {
    setLSearchQuery(value);
  };
  const [lSelectedFoodItem, setLSelectedFoodItem] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://api.edamam.com/api/food-database/v2/parser?ingr=${lSearchQuery}&app_id=97b53550&app_key=7e926f3e50058f664119bca13c924cba`
      );

      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }
      const data = await response.json();
      if (data && data.hints && data.hints.length === 0) {
        throw new Error('No foods found');
      }

      // Create a map for storing unique food items
      let foodMap = new Map();

      data.hints.forEach((item) => {
        let { foodId, label, category, nutrients } = item.food;

        // Round each nutritional value to next whole number
        // to compare them afterwards to avoid duplicates items
        let roundedNutrients = {
          ENERC_KCAL: Math.ceil(nutrients.ENERC_KCAL),
          CHOCDF: Math.ceil(nutrients.CHOCDF),
          FAT: Math.ceil(nutrients.FAT),
          FIBTG: Math.ceil(nutrients.FIBTG),
          PROCNT: Math.ceil(nutrients.PROCNT),
        };

        // Create a unique identifier
        let identifier = `${foodId}-${label}-${category}-${roundedNutrients.ENERC_KCAL}-${roundedNutrients.CHOCDF}-${roundedNutrients.FAT}-${roundedNutrients.FIBTG}-${roundedNutrients.PROCNT}`;

        // If this is a new identifier, store the item and roundedNutrients in the map
        if (!foodMap.has(identifier)) {
          foodMap.set(identifier, { ...item, roundedNutrients });
        }
      });

      // Convert the map values to an array
      let uniqueFoods = Array.from(foodMap.values());

      setLFoods(uniqueFoods);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View>
      <Image source={{ uri: item.food.image }} style={styles.image} />
      <Text style={styles.foodTitle}>{item.food.label}</Text>
      <Text>Category: {item.food.category}</Text>
      <Text>Calories: {item.roundedNutrients.ENERC_KCAL} kcal</Text>
      <Text>Carbs: {item.roundedNutrients.CHOCDF} g</Text>
      <Text>Fat: {item.roundedNutrients.FAT} g</Text>
      <Text>Fiber: {item.roundedNutrients.FIBTG} g</Text>
      <Text>Protein: {item.roundedNutrients.PROCNT} g</Text>
      <Button style={styles.button} title="Add to Meal Plan" onPress={() => addToMealPlan(item)} />
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
    <View style={styles.container}>
      <TextInput
        value={lSearchQuery}
        onChangeText={handleInputChange}
        placeholder="Search for a food..."
      />
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
      <FlatList
        data={lFoods}
        keyExtractor={(item, index) => item.food.foodId + '-' + index}
        renderItem={renderItem}
      />
      <Modal animationType="slide" transparent={true} visible={lModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>For which meal do you want to add the item to ?</Text>
            <Picker selectedValue={lSelectedMeal} onValueChange={handleMealSelection}>
              <Picker.Item label="Select meal type" value="" color="black" />
              <Picker.Item label="Breakfast" value="Breakfast" color="black" />
              <Picker.Item label="Lunch" value="Lunch" color="black" />
              <Picker.Item label="Dinner" value="Dinner" color="black" />
              <Picker.Item label="Snack" value="Snack" color="black" />
            </Picker>
            <Button title="Cancel" onPress={handleModalClose} />
          </View>
        </View>
      </Modal>
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
