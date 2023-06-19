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
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Picker } from '@react-native-picker/picker';
import { Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const [lCaloricIntake, setCaloricIntake] = useState(0);
  const [lShowResults, setShowResults] = useState(false);

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
            onChangeText={handleInputChange((text) => {
              let lAge = text.replace(/[^0-9]/g, '');
              setAge(lAge);
            })}
            value={lAge}
            keyboardType="numeric"
            maxLength={3}
          />

          <Text style={styles.label}>Gender:</Text>
          <Picker
            style={styles.picker}
            selectedValue={lGender}
            prompt="Select your gender"
            onValueChange={(itemValue) => itemValue !== 'default' && setGender(itemValue)}>
            <Picker.Item label="Select your gender" value="default" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
          </Picker>

          <Text style={styles.label}>Height (cm):</Text>
          <TextInput
            style={styles.inputFieldForm}
            onChangeText={handleInputChange((text) => {
              let lHeight = text.replace(/[^0-9]/g, '');
              setHeight(lHeight);
            })}
            value={lHeight}
            keyboardType="numeric"
            maxLength={3}
          />

          <Text style={styles.label}>Weight (kg):</Text>
          <TextInput
            style={styles.inputFieldForm}
            value={lWeight}
            onChangeText={handleInputChange((text) => {
              let newText = text.replace(/[^0-9\.]/g, '');
              if (newText.split('.').length > 2) {
                return;
              }
              // Update the text manually
              setWeight(newText);
            })}
            keyboardType="decimal-pad"
            maxLength={6}
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
          <TouchableOpacity
            style={styles.ButtonFormSubmit}
            onPress={() => {
              if (lIsFormValid) {
                setShowResults(true);
              } else {
                Alert.alert('Invalid form', 'Please make sure all fields are filled');
              }
            }}>
            <Text style={styles.buttonTextSubmit}>Submit</Text>
          </TouchableOpacity>
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
  const { lMealPlan, addMealItem, removeMealItem } = useContext(MealPlanContext);
  const [lSearchQuery, setLSearchQuery] = useState('');
  const [lFoods, setLFoods] = useState([]);
  const [lModalVisible, setLModalVisible] = useState(false);
  const [lSelectedFoodItem, setLSelectedFoodItem] = useState(null);
  const [lTempMealSelection, setTempMealSelection] = useState('');
  const [lShowDatePicker, setShowDatePicker] = useState(false);
  const [lSelectedDate, setSelectedDate] = useState(new Date());
  const [lQuantity, setQuantity] = useState(1);

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
        //console.log(foodId);
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
        <TouchableOpacity
          style={styles.ButtonAddToMealPlan}
          title="Add to Meal Plan"
          onPress={() => addToMealPlan(item)}>
          <Text style={styles.buttonText}>Add to Meal Plan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const addToMealPlan = (item) => {
    setLSelectedFoodItem({
      foodId: `${item.food.foodId}-${item.food.label}-${item.food.category}-${item.roundedNutrients.ENERC_KCAL}-${item.roundedNutrients.CHOCDF}-${item.roundedNutrients.FAT}-${item.roundedNutrients.FIBTG}-${item.roundedNutrients.PROCNT}`,
      label: item.food.label,
      category: item.food.category,
      nutrients: item.roundedNutrients.ENERC_KCAL,
      quantity: lQuantity,
    });
    //console.log(item.food.foodId);
    setLModalVisible(true);
    setQuantity(1);
    setSelectedDate(new Date());
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
    if (!lSelectedDate || !lTempMealSelection) {
      Alert.alert('Erreur', 'Veuillez choisir un jour et un repas');
    } else {
      // Convert the date to a string
      let selectedDateString = lSelectedDate.toISOString().split('T')[0];

      // Add the selected food item to the meal plan
      addMealItem(selectedDateString, lTempMealSelection, lSelectedFoodItem, lQuantity);
      //console.log(selectedDateString, lTempMealSelection, lSelectedFoodItem, lQuantity);

      Alert.alert('Succès', "L'aliment a été ajouté à votre plan de repas");
      setLSelectedFoodItem(null);
      setTempMealSelection('');
      setLModalVisible(false);
      setSelectedDate(new Date());
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
      <TouchableOpacity style={styles.buttonSearch} onPress={handleSearch}>
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
              onPress={() => setShowDatePicker(!lShowDatePicker)}>
              <Text style={styles.ButtonDateText}>{`${lSelectedDate.toDateString()}`}</Text>
            </TouchableOpacity>

            {lShowDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={lSelectedDate}
                mode={'date'}
                minimumDate={new Date()}
                is24Hour={true}
                display="default"
                onChange={handleDateChange}
              />
            )}
            <Picker selectedValue={lTempMealSelection} onValueChange={handleMealSelectionTemp}>
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
                  value={String(lQuantity)}
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
              <TouchableOpacity
                style={styles.buttonConfirmFoodDatabase}
                onPress={handleConfirmation}>
                <Text style={styles.buttonText}>Confirm</Text>
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
  const { lMealPlan, addMealItem, removeMealItem } = useContext(MealPlanContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const mealOrder = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];
  const navigation = useNavigation();
  const removeIcon = require('./assets/bin.png');

  const handleRemoveItem = (date, mealType, foodItem) => {
    removeMealItem(date, mealType, foodItem);
    setModalVisible(false);
  };

  const handleOpenModal = (item) => {
    setItemToDelete(item);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const createMealList = (selectedDate) => {
    let mealList = {};
    for (let date in lMealPlan) {
      if (date === selectedDate) {
        for (let mealType in lMealPlan[date]) {
          if (!mealList[mealType]) {
            mealList[mealType] = [];
          }
          lMealPlan[date][mealType].forEach((foodItem) => {
            mealList[mealType].push(foodItem);
          });
        }
      }
    }

    return mealList;
  };

  const handleDateChange = (offset) => {
    let newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + offset);
    setCurrentDate(newDate);
  };

  const calculateTotalCalories = (meals) => {
    let totalCalories = 0;
    for (let mealType in meals) {
      meals[mealType].forEach((foodItem) => {
        totalCalories += foodItem.foodItem.nutrients * foodItem.quantity;
      });
    }
    return totalCalories;
  };

  const meals = createMealList(currentDate.toISOString().slice(0, 10));
  const totalCalories = calculateTotalCalories(meals);

  return (
    <View style={styles.mainMealContainer}>
      <Modal visible={modalVisible} onRequestClose={handleCloseModal} transparent>
        <View style={styles.mealPlanningModalContainer}>
          <View style={styles.mealPlanningModalContent}>
            <Text style={styles.mealPlanningModalText}>
              Are you sure you want to remove {itemToDelete?.foodItem.label} from{' '}
              {itemToDelete?.mealType} ?
            </Text>
            <View style={styles.mealPlanningModalButtonContainer}>
              <TouchableOpacity
                style={styles.mealPlanningModalButtonConfirm}
                onPress={() =>
                  handleRemoveItem(itemToDelete.date, itemToDelete.mealType, itemToDelete.foodItem)
                }>
                <Text style={styles.mealPlanningButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mealPlanningModalButtonCancel}
                onPress={handleCloseModal}>
                <Text style={styles.mealPlanningButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.mealDateContainer}>
        <TouchableOpacity
          style={styles.buttonChangeDateMealPlanning}
          onPress={() => handleDateChange(-1)}>
          <Text style={styles.buttonText}>&lt;</Text>
        </TouchableOpacity>
        <Text style={styles.dateTextMealPlanning}>{currentDate.toDateString()}</Text>
        <TouchableOpacity
          style={styles.buttonChangeDateMealPlanning}
          onPress={() => handleDateChange(1)}>
          <Text style={styles.buttonText}>&gt;</Text>
        </TouchableOpacity>
      </View>
      <Text>Total Calories: {totalCalories} kcal</Text>
      <ScrollView>
        {mealOrder.map((mealType) => {
          const foodItems = meals[mealType] || [];
          return (
            //console.log(foodItems.foodId),
            <View key={mealType} style={styles.mealContainer}>
              <View style={styles.mealTypeContainer}>
                <Text style={styles.mealType}>{mealType}</Text>
                <TouchableOpacity
                  style={styles.buttonAddFoodMealPlanning}
                  onPress={() =>
                    navigation.navigate('Food Database', {
                      mealType: mealType,
                      date: currentDate.toISOString().slice(0, 10),
                    })
                  }>
                  <Text style={styles.buttonText}> + Add Food</Text>
                </TouchableOpacity>
              </View>
              {foodItems.map((foodItem) => (
                <View key={foodItem.foodItem.foodId} style={styles.foodContainer}>
                  <Text style={styles.foodLabel}>{foodItem.foodItem.label}</Text>
                  <View style={styles.foodDetailsContainer}>
                    <View>
                      <Text style={styles.foodCalories}>{foodItem.foodItem.nutrients} kcal</Text>
                      <Text style={styles.foodQuantity}>Quantity: {foodItem.quantity}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.mealPlanningButtonRemove}
                      onPress={() =>
                        handleOpenModal({
                          date: currentDate.toISOString().slice(0, 10),
                          mealType,
                          foodItem: foodItem.foodItem,
                        })
                      }>
                      <Image source={removeIcon} style={{ width: 20, height: 20 }} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

/********************************************** */
/*            Style of the whole App             */
/********************************************** */

const styles = StyleSheet.create({
  logo: {
    color: '#000000',
    width: 10,
    height: 10,
  },
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
    color: '#212121',
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
  ButtonFormSubmit: {
    backgroundColor: '#7ED9C4',
    alignSelf: 'center',
    borderRadius: 20,
    padding: 9,
    width: 150,
    justifyContent: 'center',
  },
  buttonTextSubmit: {
    color: '#47424B',
    fontSize: 14,
    textAlign: 'center',
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    position: 'absolute',
    right: 0,
    top: -80,
  },

  foodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonSearch: {
    backgroundColor: '#F4D484',
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 15,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  ButtonAddToMealPlan: {
    backgroundColor: '#F4D484',
    borderRadius: 50,
    marginTop: 15,
    marginBottom: 15,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  buttonText: {
    color: '#47424B',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
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
  buttonConfirmFoodDatabase: {
    backgroundColor: '#F4D484',
    borderColor: '#F4D484',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 5,
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

  buttonConfirmMealPlanning: {
    backgroundColor: '#9C27B0',
    borderColor: '#9C27B0',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 5,
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
    backgroundColor: '#F4D484',
    padding: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainMealContainer: {
    flex: 1,
    padding: 10,
  },
  mealDateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateTextMealPlanning: {
    marginHorizontal: 20,
  },
  mealContainer: {
    marginBottom: 10,
  },
  buttonChangeDateMealPlanning: {
    backgroundColor: '#B8A1E3',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonAddFoodMealPlanning: {
    backgroundColor: '#B8A1E3',
    borderRadius: 50,
    width: 120,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  mealType: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  foodContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: 'black',
  },
  foodLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  foodQuantity: {
    margin: 3,
    fontSize: 14,
  },
  foodCalories: {
    margin: 3,
    fontSize: 15,
  },
  mealTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  mealPlanningButtonRemove: {
    backgroundColor: '#F16262',
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  mealPlanningRemoveText: {
    color: '#fff',
    fontSize: 13,
  },
  foodDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 5,
  },

  mealPlanningModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  mealPlanningModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  mealPlanningModalText: {
    textAlign: 'center',
    fontSize: 17,
  },
  mealPlanningModalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  mealPlanningModalButtonConfirm: {
    backgroundColor: '#A483E1',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  mealPlanningModalButtonCancel: {
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  mealPlanningButtonText: {
    color: '#000000',
    fontSize: 13,
  },
});
const Tab = createBottomTabNavigator();
export const MealPlanContext = React.createContext();

export default function App() {
  const [lMealPlan, setLMealPlan] = useState({});

  const addMealItem = (date, mealType, foodItem, quantity) => {
    setLMealPlan((prevPlan) => {
      const newPlan = { ...prevPlan };
      if (!newPlan[date]) newPlan[date] = {};
      if (!newPlan[date][mealType]) newPlan[date][mealType] = [];

      //Vérifie si l'aliment existe déjà
      const existingItemIndex = newPlan[date][mealType].findIndex(
        (item) => item.foodItem.foodId === foodItem.foodId
      );

      // si oui, on incrémente
      if (existingItemIndex !== -1) {
        newPlan[date][mealType][existingItemIndex].quantity += quantity;
      } else {
        // si non, on l'ajoute
        newPlan[date][mealType].push({ foodItem, quantity });
      }

      return newPlan;
    });
  };

  const removeMealItem = (date, mealType, foodItem) => {
    setLMealPlan((prevPlan) => {
      const newPlan = { ...prevPlan };

      newPlan[date][mealType] = newPlan[date][mealType].filter(
        (item) => item.foodItem !== foodItem
      );

      return newPlan;
    });
  };

  const saveMealPlan = async (mealPlan) => {
    try {
      await AsyncStorage.setItem('@mealPlan', JSON.stringify(mealPlan));
    } catch (e) {
      console.error("can't save data");
    }
  };

  const loadMealPlan = async () => {
    try {
      let mealPlan = await AsyncStorage.getItem('@mealPlan');
      if (mealPlan !== null) {
        setLMealPlan(JSON.parse(mealPlan));
      }
    } catch (e) {
      console.error("can't load data");
    }
  };

  //Charge le plan de repas lors du montage du composant
  useEffect(() => {
    loadMealPlan();
  }, []);

  //Enregirstre le plan de repas à chaque modifications
  useEffect(() => {
    saveMealPlan(lMealPlan);
  }, [lMealPlan]);

  return (
    <MealPlanContext.Provider value={{ lMealPlan, addMealItem, removeMealItem }}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#706F87',
          }}>
          <Tab.Screen
            name="Health Goals"
            component={HealthGoalsScreen}
            options={{
              tabBarIcon: ({ focused, size }) => (
                <Image
                  source={require('./goal.png')}
                  style={{ height: size, width: size, tintColor: focused ? '#A1E4C7' : '#706F87' }}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Food Database"
            component={FoodDatabaseScreen}
            options={{
              tabBarIcon: ({ focused, size }) => (
                <Image
                  source={require('./diet.png')}
                  style={{ height: size, width: size, tintColor: focused ? '#F4D484' : '#706F87' }}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Meal Planning"
            component={MealPlanningScreen}
            options={{
              tabBarIcon: ({ focused, size }) => (
                <Image
                  source={require('./calendar.png')}
                  style={{ height: size, width: size, tintColor: focused ? '#A483E1' : '#706F87' }}
                />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </MealPlanContext.Provider>
  );
}
