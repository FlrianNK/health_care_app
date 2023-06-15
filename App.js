import React, { useState, useEffect, useContext } from 'react';
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
import DateTimePicker from '@react-native-community/datetimepicker';

/********************************************** */
/*               HealthGoalsScreen              */
/********************************************** */

function HealthGoalsScreen() {
  const [lAge, setAge] = useState('');
  const [lGender, setGender] = useState(null);
  const [lHeight, setHeight] = useState('');
  const [lWeight, setWeight] = useState('');
  const [lActivityLevel, setActivityLevel] = useState(null);
  const [lHealthGoal, setHealthGoal] = useState(null);

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
            style={styles.inputFieldForm}
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
            style={styles.inputFieldForm}
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
            style={styles.inputFieldForm}
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

/********************************************** */
/*               FoodDataBaseScreen             */
/********************************************** */

function FoodDatabaseScreen() {
  const { lMealPlan, setMealPlan } = useContext(MealPlanContext);
  const [lSearchQuery, setLSearchQuery] = useState('');
  const [lFoods, setLFoods] = useState([]);
  const [lSelectedMeal, setLSelectedMeal] = useState('');
  const [lModalVisible, setLModalVisible] = useState(false);
  const [lSelectedFoodItem, setLSelectedFoodItem] = useState(null);
  const [lSelectedDay, setLSelectedDay] = useState(new Date());
  const [tempMealSelection, setTempMealSelection] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [quantity, setQuantity] = useState(1);

  const handleInputChange = (value) => {
    setLSearchQuery(value);
  };

  const handleSearch = async () => {
    if (!lSearchQuery || lSearchQuery.trim() === '') {
      Alert.alert('Error', 'Please enter a food to search for');
      return;
    }
    try {
      const response = await fetch(
        `https://api.edamam.com/api/food-database/v2/parser?ingr=${lSearchQuery}&app_id=97b53550&app_key=6137296166e4305562e36a0538360545`
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
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Image source={{ uri: item.food.image }} style={styles.image} />
        <Text style={styles.foodTitle}>{item.food.label}</Text>
        <Text>Category: {item.food.category}</Text>
        <Text>Calories: {item.roundedNutrients.ENERC_KCAL} kcal</Text>
        <Text>Carbs: {item.roundedNutrients.CHOCDF} g</Text>
        <Text>Fat: {item.roundedNutrients.FAT} g</Text>
        <Text>Fiber: {item.roundedNutrients.FIBTG} g</Text>
        <Text>Protein: {item.roundedNutrients.PROCNT} g</Text>
        <Button
          style={styles.button}
          title="Add to Meal Plan"
          onPress={() => addToMealPlan(item)}
        />
      </View>
    </View>
  );

  const addToMealPlan = (item) => {
    item = { ...item, quantity };
    setLSelectedFoodItem(item);
    setLModalVisible(true);
  };

  const handleModalClose = () => {
    setLModalVisible(false);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };

  const handleMealSelectionTemp = (itemValue) => {
    setTempMealSelection(itemValue);
  };

  const handleConfirmation = () => {
    if (!lSelectedDay || !tempMealSelection) {
      Alert.alert('Erreur', 'Veuillez choisir un jour et un repas');
    } else {
      if (lSelectedFoodItem && lMealPlan[lSelectedDay][tempMealSelection]) {
        let lMealToAdd = tempMealSelection;
        lSelectedFoodItem.quantity = quantity;

        setMealPlan((prevPlan) => {
          const newPlan = {
            ...prevPlan,
            [lSelectedDay]: {
              ...prevPlan[lSelectedDay],
              [lMealToAdd]: [...prevPlan[lSelectedDay][lMealToAdd], lSelectedFoodItem],
            },
          };
          console.log('Updated meal plan:', prevPlan);
          return newPlan;
        });

        Alert.alert('Succès', "L'aliment a été ajouté à votre plan de repas");

        setLSelectedFoodItem(null); // Réinitialisez l'état selectedFoodItem après l'ajout
        setTempMealSelection(''); // Réinitialisez l'état tempMealSelection après l'ajout
        setLSelectedDay('');
      }
      setLModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={lSearchQuery}
        onChangeText={handleInputChange}
        style={styles.input}
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
            <Text style={styles.modalText}>Add to Meal Plan</Text>
            <Text style={styles.modalText}>Select the day and meal for this item:</Text>
            <TouchableOpacity
              style={styles.ButtonDate}
              onPress={() => setShowDatePicker(!showDatePicker)}>
              <Text style={styles.ButtonDateText}>{`${selectedDate.toDateString()}`}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={selectedDate}
                mode={'date'}
                minimumDate={new Date()}
                is24Hour={true}
                display="default"
                onChange={handleDateChange}
              />
            )}
            <Picker selectedValue={tempMealSelection} onValueChange={handleMealSelectionTemp}>
              <Picker.Item label="Select the meal" value={null} enabled={false} />
              <Picker.Item label="Breakfast" value="Breakfast" />
              <Picker.Item label="Lunch" value="Lunch" />
              <Picker.Item label="Snack" value="Snack" />
              <Picker.Item label="Dinner" value="Dinner" />
            </Picker>

            <View>
              <Text style={styles.modalText}>Quantité désirée :</Text>
              <View style={styles.quantityContainer}>
                <TextInput
                  style={styles.quantityInput}
                  value={String(quantity)}
                  onChangeText={(text) => {
                    const newQuantity = Number(text);
                    if (!Number.isNaN(newQuantity) && newQuantity > 0) {
                      setQuantity(newQuantity);
                    }
                  }}
                  keyboardType="numeric"
                  maxLength={3}
                />
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1))}>
                    <Text style={styles.buttonText}>-</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => setQuantity((prevQuantity) => prevQuantity + 1)}>
                    <Text style={styles.buttonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buttonConfirm} onPress={handleConfirmation}>
                <Text style={styles.buttonConfirmText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonCancel} onPress={handleModalClose}>
                <Text style={styles.buttonCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/********************************************** */
/*               MealPlanningScreen             */
/********************************************** */

function MealPlanningScreen() {
  const { mealPlan, setMealPlan } = useContext(MealPlanContext);
}

/********************************************** */
/*            Style of the whole App             */
/********************************************** */

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
  inputFieldForm: {
    borderWidth: 1.5,
    borderColor: '#ddd',
    padding: 10,
    fontSize: 14,
    borderRadius: 10,
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
    width: 70,
    height: 70,
    borderRadius: 35, // Pour rendre l'image circulaire
    position: 'absolute', // Position absolue par rapport à son conteneur
    right: 0, // Alignement à droite
    top: -80, // Moitié de la hauteur de l'image pour placer la moitié de l'image hors de la carte
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
    fontSize: 16,
    marginBottom: 20, // add some space below the text
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  buttonCancel: {
    backgroundColor: 'transparent',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 5,
  },
  buttonCancelText: {
    color: '#000',
  },
  buttonConfirm: {
    backgroundColor: '#293FA6',
    borderColor: '#293FA6',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 5,
  },
  buttonConfirmText: {
    color: '#fff',
  },

  ButtonDate: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'transparent',
    width: 200,
    alignSelf: 'center',
    marginBottom: 20,
    marginBottom: 10,
  },

  ButtonDateText: {
    color: '#000',
  },
  card: {
    borderRadius: 6,
    elevation: 3,
    backgroundColor: '#fff',
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,
    marginBottom: 30,
    marginTop: 30,
  },
  cardContent: {
    marginTop: 40,
    marginHorizontal: 18,
    marginVertical: 10,
    marginBottom: 20,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#000',
    width: 60,
    height: 40,
    textAlign: 'center',
    fontSize: 16,
    alignSelf: 'center',
    marginHorizontal: 10,
    marginTop: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 50,
  },
  quantityButton: {
    backgroundColor: '#293FA6',
    padding: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
});
const Tab = createBottomTabNavigator();
export const MealPlanContext = React.createContext();

export default function App() {
  const [lMealPlan, setLMealPlan] = useState({
    Monday: { meals: [] },
    Tuesday: { meals: [] },
    Wednesday: { meals: [] },
    Thursday: { meals: [] },
    Friday: { meals: [] },
    Saturday: { meals: [] },
    Sunday: { meals: [] },
  });

  return (
    <MealPlanContext.Provider value={{ mealPlan: lMealPlan, setMealPlan: setLMealPlan }}>
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
    </MealPlanContext.Provider>
  );
}
